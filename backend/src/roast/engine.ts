/**
 * Roast engine rules and logic
 * Each roast is tied to specific metrics and severity levels
 */

import { createChildLogger } from '../utils/logger.js';
import { percentage, daysBetween } from '../utils/helpers.js';
import { UserMetrics, RepositoryMetrics, AnalysisIssue } from '../analysis/types.js';
import {
  detectAbandonment,
  detectActivityGaps,
  detectForkHeavyUser,
  detectLanguageSpread,
  detectCollaborationLevel,
  detectReadmeQuality,
} from '../analysis/detectors.js';

const logger = createChildLogger({ module: 'Roast Engine' });

interface RoastRule {
  id: string;
  condition: (metrics: UserMetrics) => boolean;
  generate: (metrics: UserMetrics) => AnalysisIssue | null;
}

/**
 * Rule: Repository Abandonment
 * Detects repos that haven't been touched in a long time
 */
const abandonmentRule: RoastRule = {
  id: 'abandoned_repos',
  condition: (metrics) => metrics.abandonmentScore > 0.5,
  generate: (metrics) => {
    const abandonedRepos = metrics.repositories.filter((r) => {
      const { isAbandoned } = detectAbandonment(r);
      return isAbandoned;
    });

    if (abandonedRepos.length === 0) return null;

    const oldestRepo = abandonedRepos.reduce((oldest, current) => {
      const oldDays = daysBetween(oldest.lastCommitAt || oldest.createdAt, new Date());
      const currentDays = daysBetween(current.lastCommitAt || current.createdAt, new Date());
      return currentDays > oldDays ? current : oldest;
    });

    const daysInactive = daysBetween(oldestRepo.lastCommitAt || oldestRepo.createdAt, new Date());
    const years = Math.floor(daysInactive / 365);
    const months = Math.floor((daysInactive % 365) / 30);

    let message = `You maintain ${metrics.totalRepositories} repositories but `;
    if (abandonedRepos.length === metrics.totalRepositories) {
      message += `haven't touched ANY of them in over ${years} years`;
    } else {
      message += `${abandonedRepos.length} are collecting dust for ${years}y ${months}m`;
    }

    return {
      type: 'abandoned_repo',
      severity: years > 2 ? 'critical' : 'warning',
      title: 'Repository Graveyard',
      description: message,
      evidence: {
        total_repos: metrics.totalRepositories,
        abandoned_count: abandonedRepos.length,
        oldest_inactive_repo: oldestRepo.name,
        days_inactive: daysInactive,
      },
      score: Math.min(100, abandonedRepos.length * 15),
    };
  },
};

/**
 * Rule: Activity Gaps
 * Detects long periods without commits (laziness)
 */
const activityGapRule: RoastRule = {
  id: 'activity_gaps',
  condition: (metrics) => metrics.maxActivityGap > 60,
  generate: (metrics) => {
    const gap = metrics.maxActivityGap;

    if (gap > 730) {
      // 2 years
      return {
        type: 'activity_gap',
        severity: 'critical',
        title: 'Legendary Ghost Mode',
        description: `${Math.floor(gap / 365)} year gap between commits. That's not persistence, that's abandonment.`,
        evidence: {
          max_gap_days: gap,
          avg_gap_days: metrics.averageActivityGap,
        },
        score: 80,
      };
    } else if (gap > 180) {
      return {
        type: 'activity_gap',
        severity: 'warning',
        title: 'Inconsistent Contributor',
        description: `${Math.floor(gap / 30)} month gaps between commits. Your repos get periodic bursts, then silence.`,
        evidence: {
          max_gap_days: gap,
          avg_gap_days: metrics.averageActivityGap,
        },
        score: 50,
      };
    }

    return null;
  },
};

/**
 * Rule: Fork Heavy
 * Detects users who fork more than they create
 */
const forkHeavyRule: RoastRule = {
  id: 'fork_heavy',
  condition: (metrics) => metrics.forkRatio > 0.6,
  generate: (metrics) => {
    const { forkRatio, isForkHeavy } = detectForkHeavyUser(metrics.repositories);

    if (!isForkHeavy) return null;

    const forkPct = Math.round(forkRatio * 100);
    const originalCount = metrics.totalOriginal;

    return {
      type: 'fork_heavy',
      severity: forkRatio > 0.85 ? 'critical' : 'warning',
      title: 'Master of Copy-Paste',
      description:
        originalCount === 0
          ? `${forkPct}% of your repos are forks. You're a collector, not a creator.`
          : `${forkPct}% of your repos are forks. Only ${originalCount} original project${originalCount === 1 ? '' : 's'}.`,
      evidence: {
        fork_ratio: forkRatio,
        fork_count: metrics.totalForks,
        original_count: originalCount,
        total_repos: metrics.totalRepositories,
      },
      score: 60,
    };
  },
};

/**
 * Rule: Language Spread
 * Detects "jack of all trades, master of none" pattern
 */
const languageSpreadRule: RoastRule = {
  id: 'language_spread',
  condition: (metrics) => metrics.languageCount > 7,
  generate: (metrics) => {
    const { isTooSpread, primaryLanguages, languageCount, avgFilesPerLanguage } =
      detectLanguageSpread(metrics.repositories);

    if (!isTooSpread) return null;

    return {
      type: 'language_spread',
      severity: languageCount > 12 ? 'critical' : 'warning',
      title: 'Jack of All Trades',
      description: `You've spread yourself across ${languageCount} languages (${avgFilesPerLanguage.toFixed(1)} projects per language). Pick a lane.`,
      evidence: {
        language_count: languageCount,
        primary_languages: primaryLanguages,
        avg_files_per_language: avgFilesPerLanguage,
      },
      score: 50,
    };
  },
};

/**
 * Rule: Low Collaboration
 * Detects solo work with minimal community engagement
 */
const lowCollaborationRule: RoastRule = {
  id: 'low_engagement',
  condition: (metrics) => metrics.totalPRs < metrics.totalRepositories * 0.1,
  generate: (metrics) => {
    const { level, explanation } = detectCollaborationLevel(
      metrics.totalPRs,
      metrics.totalIssues,
      metrics.totalCommits
    );

    if (level !== 'solo') return null;

    return {
      type: 'low_engagement',
      severity: metrics.totalRepositories > 5 && metrics.totalPRs === 0 ? 'warning' : 'info',
      title: 'Lone Wolf Developer',
      description: `No PRs, minimal issues. You code in isolation. Even open-source heroes need communities.`,
      evidence: {
        pr_count: metrics.totalPRs,
        issue_count: metrics.totalIssues,
        total_repos: metrics.totalRepositories,
        collaboration_explanation: explanation,
      },
      score: 30,
    };
  },
};

/**
 * Rule: Documentation Issues
 * Detects repos with poor or missing documentation
 */
const documentationRule: RoastRule = {
  id: 'no_documentation',
  condition: (metrics) => {
    const withoutReadme = metrics.repositories.filter((r) => !r.readmePresent).length;
    return withoutReadme > metrics.totalRepositories * 0.3;
  },
  generate: (metrics) => {
    const withoutReadme = metrics.repositories.filter((r) => !r.readmePresent);
    const pct = Math.round((withoutReadme.length / metrics.totalRepositories) * 100);

    return {
      type: 'no_documentation',
      severity: pct > 70 ? 'critical' : 'warning',
      title: 'README? Never Heard of Her',
      description: `${pct}% of your repos lack proper documentation. Future you will hate current you.`,
      evidence: {
        total_repos: metrics.totalRepositories,
        without_readme: withoutReadme.length,
        percentage: pct,
        examples: withoutReadme.slice(0, 3).map((r) => r.name),
      },
      score: 45,
    };
  },
};

/**
 * Rule: Code Complexity
 * Detects repos with high cyclomatic complexity
 */
const complexityRule: RoastRule = {
  id: 'cyclomatic_complexity',
  condition: (metrics) => {
    const avgComplexity = metrics.repositories.reduce((sum, r) => sum + r.cyclomaticComplexity, 0) / metrics.totalRepositories;
    return avgComplexity > 12;
  },
  generate: (metrics) => {
    const avgComplexity = metrics.repositories.reduce((sum, r) => sum + r.cyclomaticComplexity, 0) / metrics.totalRepositories;
    const highComplexityRepos = metrics.repositories.filter((r) => r.cyclomaticComplexity > 15);

    if (highComplexityRepos.length === 0) return null;

    return {
      type: 'cyclomatic_complexity',
      severity: avgComplexity > 18 ? 'critical' : 'warning',
      title: 'Spaghetti Code Central',
      description: `Your code averages ${avgComplexity.toFixed(1)} cyclomatic complexity. Good luck debugging that.`,
      evidence: {
        avg_complexity: avgComplexity,
        high_complexity_repos: highComplexityRepos.map((r) => r.name),
        highest_complexity_repo: highComplexityRepos[0]?.name,
      },
      score: 55,
    };
  },
};

/**
 * Rule: Inactivity
 * Overall inactivity across all repos
 */
const inactivityRule: RoastRule = {
  id: 'slow_repo',
  condition: (metrics) => metrics.averageActivityGap > 90,
  generate: (metrics) => {
    const avgGap = metrics.averageActivityGap;
    const monthsAvg = Math.round(avgGap / 30);

    return {
      type: 'slow_repo',
      severity: avgGap > 200 ? 'critical' : 'warning',
      title: 'Molasses Development',
      description: `Average commit gap: ${monthsAvg} months. That's slower than enterprise waterfall.`,
      evidence: {
        average_gap_days: avgGap,
        max_gap_days: metrics.maxActivityGap,
      },
      score: 40,
    };
  },
};

// All roast rules in order of priority
const ROAST_RULES: RoastRule[] = [
  abandonmentRule,
  activityGapRule,
  forkHeavyRule,
  languageSpreadRule,
  lowCollaborationRule,
  documentationRule,
  complexityRule,
  inactivityRule,
];

/**
 * Generate all applicable roasts for a user
 */
export function generateRoasts(metrics: UserMetrics): AnalysisIssue[] {
  const roasts: AnalysisIssue[] = [];

  for (const rule of ROAST_RULES) {
    try {
      if (rule.condition(metrics)) {
        const roast = rule.generate(metrics);
        if (roast) {
          roasts.push(roast);
          logger.debug({ ruleId: rule.id, username: metrics.username }, 'Generated roast');
        }
      }
    } catch (error) {
      logger.warn({ ruleId: rule.id, error }, 'Roast rule failed');
    }
  }

  // Sort by severity (critical first)
  const severityOrder = { critical: 0, warning: 1, info: 2 };
  roasts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return roasts;
}

/**
 * Calculate final roast verdict
 */
export function generateFinalVerdict(metrics: UserMetrics, roasts: AnalysisIssue[]): string {
  const overallScore = calculateOverallScore(metrics, roasts);

  if (overallScore >= 80) {
    return `Your GitHub profile is a cautionary tale. ${metrics.totalRepositories} repos, minimal activity, and scattered focus. Time for a Git purge and a coding renaissance.`;
  } else if (overallScore >= 60) {
    return `Decent effort, but you're spreading yourself too thin. Focus on your strongest projects and actually maintain them.`;
  } else if (overallScore >= 40) {
    return `You've got the basics down. Some cleanup and better documentation would go a long way.`;
  } else if (overallScore >= 20) {
    return `Solid contributor. Keep up the momentum and consider mentoring newcomers.`;
  } else {
    return `GitHub legend status achieved. Your code quality, consistency, and community impact are exemplary.`;
  }
}

/**
 * Calculate overall roast score
 */
export function calculateOverallScore(metrics: UserMetrics, roasts: AnalysisIssue[]): number {
  let score = 0;

  // Base score from roasts
  roasts.forEach((roast) => {
    const severityMultiplier = { critical: 1.5, warning: 1, info: 0.5 }[roast.severity];
    score += roast.score * severityMultiplier;
  });

  // Bonus penalties
  if (metrics.forkRatio > 0.8) score += 20;
  if (metrics.abandonmentScore > 0.7) score += 15;
  if (metrics.languageCount > 10) score += 10;
  if (metrics.overallEngagementScore < 20) score += 15;

  // Cap at 100
  return Math.min(100, Math.round(score));
}
