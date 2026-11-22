// backend/src/server.ts
import { createApp } from './app';
import { ENV } from './config/env.config';

const app = createApp();

const server = app.listen(ENV.PORT, () => {
  console.log(`[PainVisual API] Server running at http://localhost:${ENV.PORT}${ENV.API_PREFIX}`);
  console.log(`[PainVisual API] Environment: ${ENV.NODE_ENV}`);
  console.log(`[PainVisual API] Health Endpoint: http://localhost:${ENV.PORT}${ENV.API_PREFIX}/health`);
});

process.on('SIGTERM', () => {
  console.log('[PainVisual API] SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('[PainVisual API] Server terminated.');
  });
});

export default server;
