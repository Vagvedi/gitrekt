import { Request, Response, NextFunction } from 'express';
import { getLogger } from '../../utils/logger.js';

const logger = getLogger();

/**
 * Global error handling middleware
 * Catches all errors and returns consistent error responses
 */
export function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const path = req.path;
  const method = req.method;

  if (error instanceof Error) {
    // GitHub user not found
    if (error.message.includes('Failed to fetch user')) {
      logger.warn({ path, method, error: error.message }, 'User not found');
      res.status(404).json({
        error: 'User not found',
        message: 'This GitHub user does not exist or has a private profile',
      });
      return;
    }

    // Rate limit hit
    if (error.message.includes('API rate limit')) {
      logger.warn({ path, method }, 'GitHub API rate limit hit');
      res.status(429).json({
        error: 'Rate limited',
        message: 'GitHub API rate limit exceeded. Try again in a few minutes.',
        retry_after: 300,
      });
      return;
    }

    // Validation error
    if (error.message.includes('validation')) {
      logger.warn({ path, method, error: error.message }, 'Validation error');
      res.status(400).json({
        error: 'Validation error',
        message: error.message,
      });
      return;
    }

    // Timeout
    if (error.message.includes('timeout')) {
      logger.warn({ path, method }, 'Analysis timeout');
      res.status(504).json({
        error: 'Timeout',
        message: 'Analysis took too long. Try a user with fewer repositories.',
      });
      return;
    }

    logger.error({ path, method, error: error.message }, 'Unexpected error');
    res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
    });
  } else {
    logger.error({ path, method, error }, 'Unknown error');
    res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong',
    });
  }
}

/**
 * Request logging middleware
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info(
      {
        method: req.method,
        path: req.path,
        status: res.statusCode,
        duration_ms: duration,
        ip: req.ip,
      },
      'Request completed'
    );
  });

  next();
}

/**
 * CORS middleware
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173', // Vite default
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL, // Set in env if needed
  ].filter(Boolean);

  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Max-Age', '3600');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}

/**
 * Rate limiting middleware (simple in-memory implementation)
 * For production, use redis-based solution
 */
interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

const rateLimitStore: RateLimitStore = {};

export function rateLimitMiddleware(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || 'unknown';
  const limit = 10; // requests
  const windowMs = 60000; // milliseconds (1 minute)

  const now = Date.now();
  const record = rateLimitStore[ip];

  if (!record || now > record.resetTime) {
    rateLimitStore[ip] = { count: 1, resetTime: now + windowMs };
    next();
  } else if (record.count < limit) {
    record.count++;
    next();
  } else {
    res.status(429).json({
      error: 'Too many requests',
      message: `Rate limit exceeded. Maximum ${limit} requests per minute.`,
      retry_after: Math.ceil((record.resetTime - now) / 1000),
    });
  }
}
