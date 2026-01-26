import { createChildLogger } from '../utils/logger.js';
import { daysBetween, percentage } from '../utils/helpers.js';
import { GitHubRepository, GitHubCommit } from '../github/types.js';
import { RepositoryMetrics } from './types.js';

const logger = createChildLogger({ module: 'Detectors' });

/**
 * Repository Abandonment Detector
 * Identifies repos that haven't been updated in a long time
 */
export function detectAbandonment(repo: RepositoryMetrics): {
  isAbandoned: boolean;
  score: number; // 0-100
  daysInactive: number;
  reason: string;
} {
  const now = new Date();
  const createdAt = repo.createdAt;
  const lastCommitAt = repo.lastCommitAt || repo.createdAt;

  const daysInactive = daysBetween(lastCommitAt, now);
  const totalDays = daysBetween(createdAt, now);

  // Score: ratio of inactivity to repo age
  const inactivityRatio = totalDays > 0 ? daysInactive / totalDays : 0;
  const score = Math.min(100, Math.round(inactivityRatio * 120));

  let reason = '';
  if (daysInactive > 730) {
    // 2 years
    reason = `No commits for ${Math.floor(daysInactive / 365)} years`;
  } else if (daysInactive > 180) {
    // 6 months
    reason = `No commits for ${Math.floor(daysInactive / 30)} months`;
  } else if (daysInactive > 30) {
    reason = `No commits for ${daysInactive} days`;
  }

  return {
    isAbandoned: inactivityRatio > 0.7,
    score,
    daysInactive,
    reason,
  };
}

/**
 * Activity Gap Detector
 * Identifies long periods of inactivity between commits
 */
export function detectActivityGaps(commits: GitHubCommit[]): {
  gaps: number[]; // Array of gap sizes in days
  maxGap: number;
  averageGap: number;
  suspiciousPatterns: boolean;
} {
  const gaps: number[] = [];

  if (commits.length < 2) {
    return {
      gaps: [],
      maxGap: 0,
      averageGap: 0,
      suspiciousPatterns: false,
    };
  }

  // Sort commits by date (newest first)
  const sorted = [...commits].sort((a, b) => {
    const dateA = new Date(a.commit.author.date).getTime();
    const dateB = new Date(b.commit.author.date).getTime();
    return dateB - dateA;
  });

  // Calculate gaps between consecutive commits
  for (let i = 0; i < sorted.length - 1; i++) {
    const current = new Date(sorted[i].commit.author.date);
    const next = new Date(sorted[i + 1].commit.author.date);
    const gap = daysBetween(current, next);
    if (gap > 0) {
      gaps.push(gap);
    }
  }

  const maxGap = gaps.length > 0 ? Math.max(...gaps) : 0;
  const averageGap = gaps.length > 0 ? Math.round(gaps.reduce((a, b) => a + b) / gaps.length) : 0;

  // Detect suspicious patterns like exact same time every day
  let suspiciousPatterns = false;
  if (gaps.length > 5) {
    // If most gaps are exactly 7 days (weekly), it's suspicious
    const weeklyGaps = gaps.filter((g) => g === 7).length;
    suspiciousPatterns = weeklyGaps > gaps.length * 0.5;
  }

  return {
    gaps,
    maxGap,
    averageGap,
    suspiciousPatterns,
  };
}

/**
 * Fork Ratio Detector
 * Analyzes user's tendency to fork vs create original repos
 */
export function detectForkHeavyUser(
  repos: RepositoryMetrics[]
): {
  forkRatio: number;
  isForkHeavy: boolean;
  explanation: string;
} {
  const total = repos.length;
  const forks = repos.filter((r) => r.isFork).length;
  const originals = total - forks;

  const forkRatio = total > 0 ? forks / total : 0;

  let explanation = '';
  if (forkRatio > 0.8) {
    explanation = `${percentage(forks, total)}% of repositories are forks`;
  } else if (forkRatio > 0.5) {
    explanation = `More forks (${forks}) than originals (${originals})`;
  } else if (forkRatio > 0.3) {
    explanation = `Significant fork activity (${percentage(forks, total)}%)`;
  }

  return {
    forkRatio,
    isForkHeavy: forkRatio > 0.7,
    explanation,
  };
}

/**
 * Language Spread Detector
 * Identifies users who spread themselves too thin across languages
 */
export function detectLanguageSpread(
  repos: RepositoryMetrics[]
): {
  languageCount: number;
  primaryLanguages: string[];
  isTooSpread: boolean;
  avgFilesPerLanguage: number;
  explanation: string;
} {
  const languageMap = new Map<string, number>();

  // Aggregate language usage
  repos.forEach((repo) => {
    if (repo.language && repo.language !== 'null') {
      languageMap.set(repo.language, (languageMap.get(repo.language) || 0) + 1);
    }
  });

  const languageCount = languageMap.size;
  const primaryLanguages = Array.from(languageMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([lang]) => lang);

  const avgFilesPerLanguage = repos.length > 0 ? repos.length / Math.max(1, languageCount) : 0;

  let explanation = '';
  if (languageCount > 10) {
    explanation = `Dabbling in ${languageCount} languages`;
  } else if (languageCount > 5) {
    explanation = `Working across ${languageCount} different languages`;
  }

  return {
    languageCount,
    primaryLanguages,
    isTooSpread: languageCount > 8 && avgFilesPerLanguage < 2,
    avgFilesPerLanguage,
    explanation,
  };
}

/**
 * Cyclomatic Complexity Detector
 * Simple estimation based on file size and assumed structure
 */
export function estimateCyclomaticComplexity(fileCount: number): {
  estimated: number;
  risk: 'low' | 'medium' | 'high';
} {
  // Rough heuristic: assume ~5 functions per 100 lines
  // and ~2 conditionals per function on average
  const estimated = Math.max(1, Math.round(fileCount * 0.8));

  let risk: 'low' | 'medium' | 'high' = 'low';
  if (estimated > 15) {
    risk = 'high';
  } else if (estimated > 8) {
    risk = 'medium';
  }

  return { estimated, risk };
}

/**
 * Duplication Detector
 * Simple token-based similarity estimation
 */
export function estimateDuplication(content: string[]): number {
  if (content.length < 2) return 0;

  // Very simple: look for repeated code blocks
  const tokens = content.flatMap((c) => c.split(/\s+/));
  const tokenCounts = new Map<string, number>();

  tokens.forEach((token) => {
    if (token.length > 5) {
      // Only count meaningful tokens
      tokenCounts.set(token, (tokenCounts.get(token) || 0) + 1);
    }
  });

  let duplicatedTokens = 0;
  tokenCounts.forEach((count) => {
    if (count > 1) {
      duplicatedTokens += count - 1;
    }
  });

  const duplicationRatio = tokens.length > 0 ? duplicatedTokens / tokens.length : 0;
  return Math.min(100, Math.round(duplicationRatio * 100));
}

/**
 * README Quality Detector
 */
export function detectReadmeQuality(
  readmeContent: string | null | undefined
): 'missing' | 'poor' | 'good' | 'excellent' {
  if (!readmeContent) {
    return 'missing';
  }

  const content = readmeContent.toLowerCase();
  let score = 0;

  // Has sections
  if (content.includes('## installation') || content.includes('### installation'))
    score += 20;
  if (content.includes('## usage') || content.includes('### usage')) score += 20;
  if (content.includes('## features') || content.includes('### features')) score += 15;
  if (content.includes('## contributing') || content.includes('### contributing')) score += 15;
  if (content.includes('## license') || content.includes('### license')) score += 10;

  // Has code examples
  if (content.includes('```')) score += 10;

  // Has meaningful length
  if (content.length > 500) score += 10;

  if (score >= 80) return 'excellent';
  if (score >= 50) return 'good';
  if (score >= 20) return 'poor';
  return 'poor';
}

/**
 * Collaboration Detector
 * Analyzes PR and issue activity
 */
export function detectCollaborationLevel(
  prCount: number,
  issueCount: number,
  commitCount: number
): {
  collaborationScore: number; // 0-100
  level: 'solo' | 'light' | 'active' | 'highly-collaborative';
  explanation: string;
} {
  const prRatio = commitCount > 0 ? prCount / commitCount : 0;
  const issueRatio = commitCount > 0 ? issueCount / commitCount : 0;

  let score = 0;
  let level: 'solo' | 'light' | 'active' | 'highly-collaborative' = 'solo';
  let explanation = '';

  // PR engagement
  if (prRatio > 0.1) {
    score += 30;
  } else if (prRatio > 0.05) {
    score += 15;
  }

  // Issue engagement
  if (issueRatio > 0.1) {
    score += 30;
  } else if (issueRatio > 0.05) {
    score += 15;
  }

  // Absolute numbers
  if (prCount + issueCount > 100) score += 25;
  else if (prCount + issueCount > 20) score += 10;

  if (score >= 75) {
    level = 'highly-collaborative';
    explanation = 'Strong PR and issue engagement';
  } else if (score >= 50) {
    level = 'active';
    explanation = 'Moderate community engagement';
  } else if (score >= 20) {
    level = 'light';
    explanation = 'Some PR and issue activity';
  } else {
    level = 'solo';
    explanation = 'Primarily solo work';
  }

  return { collaborationScore: score, level, explanation };
}
