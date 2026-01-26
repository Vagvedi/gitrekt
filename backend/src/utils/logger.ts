import pino, { Logger } from 'pino';
import { getEnv } from './env.js';

/**
 * Global logger instance with structured logging
 * Supports different log levels based on environment
 */
let loggerInstance: Logger | null = null;

export function getLogger(): Logger {
  if (loggerInstance) return loggerInstance;

  const env = getEnv();

  loggerInstance = pino({
    level: env.LOG_LEVEL,
    transport:
      env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              ignore: 'pid,hostname',
              singleLine: false,
            },
          }
        : undefined,
  });

  return loggerInstance;
}

/**
 * Create a child logger with additional context
 */
export function createChildLogger(context: Record<string, unknown>): Logger {
  return getLogger().child(context);
}
