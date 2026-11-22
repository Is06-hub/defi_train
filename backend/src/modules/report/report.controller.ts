// backend/src/modules/report/report.controller.ts
import { Request, Response, NextFunction } from 'express';
import { ReportService } from './report.service';
import { formatSuccess } from '../../utils/responseFormatter';

export class ReportController {
  public static async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const recordId = req.params.recordId;
      const { includeAudio, clientRenderedSnapshot } = req.body;
      const result = await ReportService.generateReport(recordId, includeAudio, clientRenderedSnapshot);
      res.status(201).json(formatSuccess(result));
    } catch (error) {
      next(error);
    }
  }

  public static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const reportId = req.params.id;
      const result = await ReportService.getReportById(reportId);
      res.status(200).json(formatSuccess(result));
    } catch (error) {
      next(error);
    }
  }
}
