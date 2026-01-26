import { Router, Request, Response, NextFunction } from 'express';
import { getGitHubClient } from '../../github/client.js';
import { calculateRepositoryMetrics, calculateUserMetrics } from '../../analysis/metrics.js';
import { generateRoasts, generateFinalVerdict, calculateOverallScore } from '../../roast/engine.js';
import { createChildLogger } from '../../utils/logger.js';
import { getEnv } from '../../utils/env.js';
import { validateUsername, validateQuery } from '../middleware/validation.js';

const router = Router();
const logger = createChildLogger({ module: 'Analyze Route' });
const env = getEnv();

interface AnalyzeResponse {
  username: string;
  overall_score: number;
  metrics: {
    total_repos: number;
    total_stars: number;
    total_commits: number;
    primary_languages: string[];
    fork_ratio: number;
    abandonment_score: number;
    code_quality_score: number;
    engagement_score: number;
  };
  roasts: Array<{
    severity: string;
    title: string;
    message: string;
    evidence: Record<string, unknown>;
  }>;
  final_verdict: string;
  generated_at: string;
  cache_hit: boolean;
}

// Simple in-memory cache
const analysisCache = new Map<string, { data: AnalyzeResponse; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

/**
 * POST /api/v1/analyze/:username
 * Generate a roast for a GitHub user
 */
router.post(
  '/analyze/:username',
  validateUsername,
  validateQuery,
  async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;
    const { force = 'false', include_analysis = 'true' } = req.query;
    const shouldForce = force === 'true';

    try {
      logger.info({ username }, 'Starting roast analysis');

      // Check cache
      const cached = analysisCache.get(username.toLowerCase());
      if (cached && !shouldForce && Date.now() - cached.timestamp < CACHE_TTL) {
        logger.info({ username }, 'Cache hit');
        res.json({ ...cached.data, cache_hit: true });
        return;
      }

      // Fetch GitHub data
      const client = getGitHubClient();
      const user = await client.getUser(username);
      const repos = await client.getUserRepositories(username);

      logger.info({ username, repos: repos.length }, 'Fetched GitHub data');

      // Calculate metrics for each repo
      const repoMetrics = await Promise.all(
        repos.map((repo) => calculateRepositoryMetrics(repo, username))
      );

      // Calculate user metrics
      const userMetrics = calculateUserMetrics(user, repoMetrics);

      // Generate roasts
      const roasts = generateRoasts(userMetrics);
      const overallScore = calculateOverallScore(userMetrics, roasts);
      const finalVerdict = generateFinalVerdict(userMetrics, roasts);

      const response: AnalyzeResponse = {
        username: user.login,
        overall_score: overallScore,
        metrics: {
          total_repos: userMetrics.totalRepositories,
          total_stars: userMetrics.totalStars,
          total_commits: userMetrics.totalCommits,
          primary_languages: userMetrics.primaryLanguages,
          fork_ratio: userMetrics.forkRatio,
          abandonment_score: userMetrics.abandonmentScore,
          code_quality_score: userMetrics.codeQualityScore,
          engagement_score: userMetrics.overallEngagementScore,
        },
        roasts: roasts.map((roast) => ({
          severity: roast.severity,
          title: roast.title,
          message: roast.description,
          evidence: roast.evidence,
        })),
        final_verdict: finalVerdict,
        generated_at: new Date().toISOString(),
        cache_hit: false,
      };

      // Cache the result
      analysisCache.set(username.toLowerCase(), {
        data: response,
        timestamp: Date.now(),
      });

      logger.info(
        { username, score: overallScore, roasts: roasts.length },
        'Roast analysis complete'
      );
      res.json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
