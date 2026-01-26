/**
 * Analysis type definitions
 */

export interface RepositoryMetrics {
  name: string;
  isFork: boolean;
  isArchived: boolean;
  createdAt: Date;
  lastCommitAt: Date | null;
  commitCount: number;
  language: string | null;
  languages: Record<string, number>;
  fileCount: number;
  averageFileSize: number;
  longestFileSize: number;
  cyclomaticComplexity: number;
  duplicatePercentage: number;
  readmePresent: boolean;
  readmeQuality: 'missing' | 'poor' | 'good' | 'excellent';
  prCount: number;
  issueCount: number;
  starCount: number;
  forkCount: number;
}

export interface UserMetrics {
  username: string;
  createdAt: Date;
  repositories: RepositoryMetrics[];
  totalRepositories: number;
  totalForks: number;
  totalOriginal: number;
  totalCommits: number;
  totalIssues: number;
  totalPRs: number;
  totalStars: number;
  primaryLanguages: string[];
  languageCount: number;
  averageCommitsPerRepo: number;
  abandonmentScore: number; // 0-1, higher = more abandoned
  activityGaps: number[]; // Days between commits
  maxActivityGap: number; // Longest gap in days
  averageActivityGap: number;
  forkRatio: number; // forks / total_repos
  codeQualityScore: number; // 0-100
  overallEngagementScore: number; // 0-100
}

export interface AnalysisResult {
  username: string;
  metrics: UserMetrics;
  issues: AnalysisIssue[];
  recommendations: string[];
  analysisMetadata: {
    analyzedAt: Date;
    analysisTimeMs: number;
    repositoriesAnalyzed: number;
    filesAnalyzed: number;
    linesOfCodeAnalyzed: number;
    cacheHit: boolean;
  };
}

export interface AnalysisIssue {
  type:
    | 'abandoned_repo'
    | 'activity_gap'
    | 'cyclomatic_complexity'
    | 'god_file'
    | 'duplicate_code'
    | 'language_spread'
    | 'no_documentation'
    | 'low_engagement'
    | 'fork_heavy'
    | 'slow_repo';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  repository?: string;
  evidence: Record<string, unknown>;
  score: number; // 0-100
}

export interface CommitPattern {
  dayOfWeek: number;
  hourOfDay: number;
  date: Date;
}

export interface CodeDuplication {
  file1: string;
  file2: string;
  similarity: number; // 0-1
  lines: number;
  startLine1: number;
  startLine2: number;
}
