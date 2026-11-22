// backend/src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { db } from '../config/database.config';
import { AppError } from './errorHandler.middleware';
import { Session } from '../types/painSession.types';

declare global {
  namespace Express {
    interface Request {
      session?: Session;
    }
  }
}

export function requireSessionAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError(401, 'UNAUTHORIZED', 'رمز الجلسة مفقود في ترويسة الطلب');
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    throw new AppError(401, 'UNAUTHORIZED', 'رمز الجلسة غير صالح');
  }

  const session = db.getSessionByToken(token);
  if (!session) {
    throw new AppError(404, 'SESSION_NOT_FOUND', 'الجلسة غير مسجلة أو تم إنهاؤها');
  }

  if (session.status === 'expired' || new Date(session.expiresAt) < new Date()) {
    throw new AppError(401, 'SESSION_EXPIRED', 'انتهت فترة صلاحية الجلسة المؤقتة (تجاوزت 6 ساعات)');
  }

  req.session = session;
  next();
}
