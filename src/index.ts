import { Server } from 'http';
import app from './app';
import config from './config';
 import { logger } from './shared/logger';

async function flutter() {
  const server: Server = app.listen(config.port, () => {
    logger.info(`Server running on port ${config.port}`);
   });

  const exitHandler = () => {
    if (server) {
      server.close(() => {
        logger.info('Server closed');
        process.exit(0); // Exit with code 0 for successful exit
      });
    } else {
      process.exit(0); // Exit with code 0 even if server is not defined
    }
  };

  const unexpectedErrorHandler = (error: Error) => {
    console.error(error);
    exitHandler();
  };

  process.on('unhandledRejection', unexpectedErrorHandler);

  // Handle SIGINT (Ctrl+C) to gracefully shut down the server during development
  process.on('SIGINT', () => {
    logger.info('SIGINT received');
    exitHandler();
  });
}

flutter();
