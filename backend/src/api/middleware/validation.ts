import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { isValidGitHubUsername } from '../../utils/helpers.js';

/**
 * Validation middleware for request parameters
 */

export function validateUsername(req: Request, res: Response, next: NextFunction): void {
  const { username } = req.params;

  if (!username) {
    res.status(400).json({
      error: 'Validation error',
      message: 'Username is required',
    });
    return;
  }

  if (!isValidGitHubUsername(username)) {
    res.status(400).json({
      error: 'Validation error',
      message: 'Invalid GitHub username format. Only alphanumeric characters and hyphens allowed.',
    });
    return;
  }

  if (username.length > 39) {
    res.status(400).json({
      error: 'Validation error',
      message: 'GitHub username must be 39 characters or less',
    });
    return;
  }

  next();
}

/**
 * Validate request body
 */
const querySchema = z.object({
  force: z.enum(['true', 'false']).optional(),
  include_analysis: z.enum(['true', 'false']).optional(),
});

export function validateQuery(req: Request, res: Response, next: NextFunction): void {
  const result = querySchema.safeParse(req.query);

  if (!result.success) {
    res.status(400).json({
      error: 'Validation error',
      message: 'Invalid query parameters',
      details: result.error.issues,
    });
    return;
  }

  next();
}
