import { Router, Request, Response } from 'express';
import { getGitHubClient } from '../../github/client.js';
import { createChildLogger } from '../../utils/logger.js';

const router = Router();
const logger = createChildLogger({ module: 'Health Route' });

/**
 * GET /api/v1/health
 * Health check endpoint
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const client = getGitHubClient();
    const rateLimit = await client.getRateLimit();

    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      github_api: {
        status: rateLimit.remaining > 0 ? 'connected' : 'rate_limited',
        rate_limit: {
          remaining: rateLimit.remaining,
          limit: rateLimit.limit,
        },
      },
    });
  } catch (error) {
    logger.error({ error }, 'Health check failed');
    res.status(503).json({
      status: 'degraded',
      timestamp: new Date().toISOString(),
      github_api: {
        status: 'disconnected',
      },
    });
  }
});

export default router;
