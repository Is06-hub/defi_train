// backend/src/middlewares/errorHandler.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { formatError } from '../utils/responseFormatter';

export class AppError extends Error {
  public statusCode: number;
  public errorCode: string;
  public fields?: Record<string, string>;

  constructor(statusCode: number, errorCode: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.fields = fields;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // If headers already sent, delegate to Express default handler
  if (res.headersSent) {
    return next(err);
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    res.status(err.statusCode).json(formatError(err.errorCode, err.message, err.fields));
    return;
  }

  // Handle Zod Validation Error
  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    err.errors.forEach((issue) => {
      const fieldPath = issue.path.join('.') || 'body';
      fields[fieldPath] = issue.message;
    });

    res.status(400).json(formatError('VALIDATION_ERROR', 'بيانات الإدخال غير صالحة', fields));
    return;
  }

  // Handle JSON Syntax Error in request body
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json(formatError('VALIDATION_ERROR', 'بنية JSON المدخلة غير صحيحة'));
    return;
  }

  // Catch-all Internal Server Error
  console.error('[UNHANDLED_ERROR]:', err);
  res.status(500).json(formatError('INTERNAL_ERROR', 'حدث خطأ داخلي في الخادم'));
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json(formatError('NOT_FOUND', `المسار المطلوب غير موجود: ${req.method} ${req.originalUrl}`));
}
