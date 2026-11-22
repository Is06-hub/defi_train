// backend/src/modules/session/session.controller.ts
import { Request, Response, NextFunction } from 'express';
import { SessionService } from './session.service';
import { formatSuccess } from '../../utils/responseFormatter';

export class SessionController {
  public static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await SessionService.createSession(req.body);
      res.status(201).json(formatSuccess(result));
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const sessionId = req.params.id;
      const result = await SessionService.getSessionById(sessionId);
      res.status(200).json(formatSuccess(result));
    } catch (error) {
      next(error);
    }
  }
}
