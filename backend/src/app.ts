// backend/src/app.ts
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { ENV } from './config/env.config';
import sessionRoutes from './modules/session/session.routes';
import painRecordRoutes from './modules/painRecord/painRecord.routes';
import audioRoutes from './modules/audio/audio.routes';
import reportRoutes from './modules/report/report.routes';
import systemRoutes from './modules/system/system.routes';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware';

export function createApp(): Application {
  const app = express();

  // Security Middlewares
  app.use(helmet());
  app.use(
    cors({
      origin: ENV.CORS_ORIGIN,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Doctor-Token']
    })
  );

  // Body parser
  app.use(express.json({ limit: '1mb' }));

  // Routes mounting under /v1
  app.use(`${ENV.API_PREFIX}/sessions`, sessionRoutes);
  app.use(`${ENV.API_PREFIX}/pain-records`, painRecordRoutes);
  app.use(`${ENV.API_PREFIX}/pain-records`, audioRoutes);
  app.use(`${ENV.API_PREFIX}/reports`, reportRoutes);
  app.use(`${ENV.API_PREFIX}`, systemRoutes);

  // 404 Not Found Handler
  app.use(notFoundHandler);

  // Central Error Handler
  app.use(errorHandler);

  return app;
}
