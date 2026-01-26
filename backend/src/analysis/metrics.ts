import { createChildLogger } from '../utils/logger.js';
import { daysBetween, percentage } from '../utils/helpers.js';
import { getGitHubClient } from '../github/client.js';
import { GitHubRepository, GitHubCommit, GitHubUser } from '../github/types.js';
import { RepositoryMetrics, UserMetrics } from './types.js';
import {
  detectAbandonment,
  detectActivityGaps,
  detectForkHeavyUser,
  detectLanguageSpread,
  estimateCyclomaticComplexity,
  estimateDuplication,
  detectReadmeQuality,
  detectCollaborationLevel,
} from './detectors.js';

const logger = createChildLogger({ module: 'Metrics Calculator' });

/**
 * Calculate metrics for a single repository
 */
export async function calculateRepositoryMetrics(
  repo: GitHubRepository,
  username: string
): Promise<RepositoryMetrics> {
  const client = getGitHubClient();

  try {
    // Fetch commit history
    const { commits, totalCount } = await client.getCommitHistory(username, repo.name);
    const lastCommitAt =
      commits.length > 0 ? new Date(commits[0].commit.author.date) : null;

    // Fetch README
    const readme = await client.getReadme(username, repo.name);
    const readmeQuality = detectReadmeQuality(readme);

    // Fetch languages
    const languages = await client.getLanguages(username, repo.name);

    // Estimate complexity based on content
    const { estimated: cyclomaticComplexity } = estimateCyclomaticComplexity(
      repo.size / 10 || 1
    );

    // Estimate duplication
    const duplicatePercentage = estimateDuplication([readme || ''].filter(Boolean));

    // Primary language
    const primaryLanguage = Object.entries(languages)
      .sort((a, b) => b[1] - a[1])[0]?.[0] || repo.language;

    const metrics: RepositoryMetrics = {
      name: repo.name,
      isFork: repo.fork,
      isArchived: false, // TODO: Get from GraphQL if available
      createdAt: new Date(repo.created_at),
      lastCommitAt,
      commitCount: totalCount,
      language: primaryLanguage,
      languages,
      fileCount: Math.max(1, Math.round(repo.size / 10)), // Rough estimate
      averageFileSize: repo.size > 0 ? Math.round(repo.size / Math.max(1, repo.size / 10)) : 0,
      longestFileSize: repo.size,
      cyclomaticComplexity,
      duplicatePercentage,
      readmePresent: !!readme,
      readmeQuality,
      prCount: 0, // TODO: Fetch from GitHub
      issueCount: repo.open_issues_count,
      starCount: repo.stargazers_count,
      forkCount: repo.forks_count,
    };

    logger.debug({ repo: repo.name }, 'Calculated repository metrics');
    return metrics;
  } catch (error) {
    logger.error({ repo: repo.name, error }, 'Failed to calculate repository metrics');
    // Return minimal metrics on error
    return {
      name: repo.name,
      isFork: repo.fork,
      isArchived: false,
      createdAt: new Date(repo.created_at),
      lastCommitAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
      commitCount: 0,
      language: repo.language,
      languages: {},
      fileCount: 1,
      averageFileSize: repo.size,
      longestFileSize: repo.size,
      cyclomaticComplexity: 0,
      duplicatePercentage: 0,
      readmePresent: false,
      readmeQuality: 'missing',
      prCount: 0,
      issueCount: repo.open_issues_count,
      starCount: repo.stargazers_count,
      forkCount: repo.forks_count,
    };
  }
}

/**
 * Calculate overall user metrics from repository metrics
 */
export function calculateUserMetrics(
  user: GitHubUser,
  repoMetrics: RepositoryMetrics[]
): UserMetrics {
  const totalRepositories = repoMetrics.length;
  const totalForks = repoMetrics.filter((r) => r.isFork).length;
  const totalOriginal = totalRepositories - totalForks;
  const totalCommits = repoMetrics.reduce((sum, r) => sum + r.commitCount, 0);
  const totalIssues = repoMetrics.reduce((sum, r) => sum + r.issueCount, 0);
  const totalPRs = repoMetrics.reduce((sum, r) => sum + r.prCount, 0);
  const totalStars = repoMetrics.reduce((sum, r) => sum + r.starCount, 0);

  // Languages
  const languageMap = new Map<string, number>();
  repoMetrics.forEach((repo) => {
    if (repo.language) {
      languageMap.set(repo.language, (languageMap.get(repo.language) || 0) + 1);
    }
  });

  const primaryLanguages = Array.from(languageMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang);

  const languageCount = languageMap.size;

  // Abandonment score (average across repos)
  let totalAbandonmentScore = 0;
  repoMetrics.forEach((repo) => {
    const { score } = detectAbandonment(repo);
    totalAbandonmentScore += score;
  });
  const abandonmentScore =
    repoMetrics.length > 0 ? totalAbandonmentScore / repoMetrics.length / 100 : 0;

  // Activity analysis
  const activityGaps: number[] = [];
  const allDays: number[] = [];

  repoMetrics.forEach((repo) => {
    // Estimate activity from commit count and time span
    if (repo.lastCommitAt && repo.createdAt) {
      const span = daysBetween(repo.createdAt, repo.lastCommitAt);
      if (span > 0 && repo.commitCount > 1) {
        const avgGap = Math.round(span / repo.commitCount);
        allDays.push(avgGap);
      }
    }
  });

  const maxActivityGap = allDays.length > 0 ? Math.max(...allDays) : 0;
  const averageActivityGap = allDays.length > 0 ? Math.round(allDays.reduce((a, b) => a + b) / allDays.length) : 0;

  // Fork ratio
  const forkRatio = totalRepositories > 0 ? totalForks / totalRepositories : 0;

  // Code quality score
  const avgCyclomaticComplexity =
    repoMetrics.length > 0
      ? repoMetrics.reduce((sum, r) => sum + r.cyclomaticComplexity, 0) / repoMetrics.length
      : 0;

  const codeQualityScore = Math.max(0, 100 - (avgCyclomaticComplexity * 3 + abandonmentScore * 20));

  // Engagement score
  const engagementScore = Math.min(
    100,
    (totalPRs * 5 + totalStars * 2 + (totalIssues > 0 ? 30 : 0)) /
      Math.max(1, totalRepositories)
  );

  const metrics: UserMetrics = {
    username: user.login,
    createdAt: new Date(user.created_at),
    repositories: repoMetrics,
    totalRepositories,
    totalForks,
    totalOriginal,
    totalCommits,
    totalIssues,
    totalPRs,
    totalStars,
    primaryLanguages,
    languageCount,
    averageCommitsPerRepo: totalRepositories > 0 ? Math.round(totalCommits / totalRepositories) : 0,
    abandonmentScore,
    activityGaps,
    maxActivityGap,
    averageActivityGap,
    forkRatio,
    codeQualityScore,
    overallEngagementScore: engagementScore,
  };

  logger.debug(
    {
      username: user.login,
      repos: totalRepositories,
      commits: totalCommits,
      codeQuality: codeQualityScore,
      engagement: engagementScore,
    },
    'Calculated user metrics'
  );

  return metrics;
}
