import 'dotenv/config';
import { startServer } from './api/server.js';
import { getLogger } from './utils/logger.js';

const logger = getLogger();

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error({ error }, 'Uncaught exception');
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
  logger.error({ reason }, 'Unhandled rejection');
  process.exit(1);
});

// Start server
startServer().catch((error) => {
  logger.error({ error }, 'Failed to start server');
  process.exit(1);
});
