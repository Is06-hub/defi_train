// backend/src/modules/painRecord/painRecord.controller.ts
import { Request, Response, NextFunction } from 'express';
import { PainRecordService } from './painRecord.service';
import { formatSuccess } from '../../utils/responseFormatter';

export class PainRecordController {
  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const record = await PainRecordService.getRecordById(req.params.id);
      res.status(200).json(formatSuccess(record));
    } catch (error) {
      next(error);
    }
  }

  public static async updateLocation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PainRecordService.updateLocations(req.params.id, req.body.locations);
      res.status(200).json(formatSuccess(result));
    } catch (error) {
      next(error);
    }
  }

  public static async updateRadiation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PainRecordService.updateRadiations(req.params.id, req.body.radiations);
      res.status(200).json(formatSuccess(result));
    } catch (error) {
      next(error);
    }
  }

  public static async updateIntensity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PainRecordService.updateIntensities(req.params.id, req.body.intensities);
      res.status(200).json(formatSuccess(result));
    } catch (error) {
      next(error);
    }
  }

  public static async updateNature(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PainRecordService.updateSensations(req.params.id, req.body.sensations);
      res.status(200).json(formatSuccess(result));
    } catch (error) {
      next(error);
    }
  }

  public static async updateTiming(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PainRecordService.updateTiming(req.params.id, req.body.timing);
      res.status(200).json(formatSuccess(result));
    } catch (error) {
      next(error);
    }
  }

  public static async updateMovements(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await PainRecordService.updateMovements(req.params.id, req.body.movements);
      res.status(200).json(formatSuccess(result));
    } catch (error) {
      next(error);
    }
  }

  // F8: In-place dimension mutation
  public static async mutateDimension(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { targetDimension, payload } = req.body;
      const result = await PainRecordService.mutateDimension(req.params.id, targetDimension, payload);
      res.status(200).json(formatSuccess(result));
    } catch (error) {
      next(error);
    }
  }
}
