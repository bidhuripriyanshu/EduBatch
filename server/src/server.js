import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

const startServer = async () => {
  // Connect to Database
  await connectDB();

  const server = app.listen(config.port, () => {
    console.log(`🚀 [EduBatch Express API Server]: Running on port ${config.port} in ${config.nodeEnv} mode`);
  });

  process.on('unhandledRejection', (err) => {
    console.error('[UNHANDLED REJECTION! Shutting down...]', err);
    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();
