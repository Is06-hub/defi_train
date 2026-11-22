// backend/src/modules/audio/audio.controller.ts
import { Request, Response, NextFunction } from 'express';
import { AudioService } from './audio.service';
import { formatSuccess } from '../../utils/responseFormatter';

export class AudioController {
  public static async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recordId = req.params.id;
      const durationSeconds = parseInt(req.body.durationSeconds || '30', 10);
      const result = await AudioService.uploadAudio(recordId, durationSeconds, req.body.audioFile);
      res.status(201).json(formatSuccess(result));
    } catch (error) {
      next(error);
    }
  }

  public static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recordId = req.params.id;
      await AudioService.deleteAudio(recordId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
