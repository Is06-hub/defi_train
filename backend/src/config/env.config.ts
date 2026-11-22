// backend/src/config/env.config.ts
import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  API_PREFIX: '/v1',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
  SESSION_TTL_HOURS: 6,
  REPORT_TTL_HOURS: 48,
  MAX_AUDIO_DURATION_SECONDS: 45,
  MAX_AUDIO_SIZE_BYTES: 10 * 1024 * 1024 // 10MB
};
