/**
 * Utility helper functions for the application
 */

/**
 * Sanitize GitHub username for logging
 */
export function sanitizeUsername(username: string): string {
  return username.replace(/[^a-zA-Z0-9\-]/g, '');
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: Date, date2: Date): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.floor(Math.abs(date2.getTime() - date1.getTime()) / msPerDay);
}

/**
 * Calculate percentage
 */
export function percentage(part: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((part / total) * 10000) / 100;
}

/**
 * Wait for specified milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Safely parse JSON
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

/**
 * Chunk array into smaller arrays
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

/**
 * Normalize repository URL
 */
export function normalizeRepoUrl(url: string): string {
  return url.replace(/\.git$/, '').replace(/https?:\/\//, '');
}

/**
 * Validate GitHub username format
 */
export function isValidGitHubUsername(username: string): boolean {
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9\-]{0,38}[a-zA-Z0-9])?$/.test(username);
}
