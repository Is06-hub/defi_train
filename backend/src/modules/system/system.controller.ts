// backend/src/modules/system/system.controller.ts
import { Request, Response } from 'express';
import { SystemService } from './system.service';
import { formatSuccess } from '../../utils/responseFormatter';

export class SystemController {
  public static getHealth(req: Request, res: Response): void {
    const health = SystemService.getHealth();
    res.status(200).json(formatSuccess(health));
  }

  public static getConfig(req: Request, res: Response): void {
    const config = SystemService.getConfig();
    // Cacheable for 24 hours per contract
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.status(200).json(formatSuccess(config));
  }
}
