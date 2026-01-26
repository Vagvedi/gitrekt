import express, { Express } from 'express';
import { getEnv } from '../utils/env.js';
import { getLogger } from '../utils/logger.js';
import {
  errorHandler,
  requestLogger,
  corsMiddleware,
  rateLimitMiddleware,
} from './middleware/errorHandler.js';
import analyzeRouter from './routes/analyze.js';
import healthRouter from './routes/health.js';

const env = getEnv();
const logger = getLogger();

export function createServer(): Express {
  const app = express();

  // Trust proxy
  app.set('trust proxy', 1);

  // Body parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  // Logging
  app.use(requestLogger);

  // Security & CORS
  app.use(corsMiddleware);

  // Rate limiting
  app.use(rateLimitMiddleware);

  // Routes
  app.use('/api/v1', healthRouter);
  app.use('/api/v1', analyzeRouter);

  // Health check root
  app.get('/', (req, res) => {
    res.json({
      name: 'gitrekt',
      version: '1.0.0',
      description: 'GitHub Roaster API',
      docs: '/api/v1/health',
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: 'Not found',
      message: 'This endpoint does not exist',
      path: req.path,
    });
  });

  // Error handling (must be last)
  app.use(errorHandler);

  return app;
}

export async function startServer(): Promise<void> {
  const app = createServer();

  app.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        env: env.NODE_ENV,
      },
      'Server started'
    );
  });
}
