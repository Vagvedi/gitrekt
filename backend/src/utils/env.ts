import { z } from 'zod';

/**
 * Validates and parses environment variables
 * Ensures all required variables are present and valid
 */
const envSchema = z.object({
  GITHUB_TOKEN: z.string().min(1, 'GITHUB_TOKEN is required'),
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),
  REDIS_URL: z.string().optional(),
  RATE_LIMIT_REQUESTS: z.coerce.number().default(10),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  ANALYSIS_TIMEOUT_MS: z.coerce.number().default(30000),
  GITHUB_GRAPHQL_TIMEOUT: z.coerce.number().default(10000),
});

type Env = z.infer<typeof envSchema>;

let cachedEnv: Env | null = null;

/**
 * Get validated environment configuration
 */
export function getEnv(): Env {
  if (cachedEnv) return cachedEnv;

  const env = process.env as Record<string, string | undefined>;
  const parsed = envSchema.safeParse(env);

  if (!parsed.success) {
    console.error('Environment validation failed:', parsed.error.issues);
    throw new Error('Invalid environment configuration');
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export type { Env };
