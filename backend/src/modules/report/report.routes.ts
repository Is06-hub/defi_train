// backend/src/modules/report/report.routes.ts
import { Router } from 'express';
import { ReportController } from './report.controller';
import { requireSessionAuth } from '../../middlewares/auth.middleware';
import { validateBody } from '../../middlewares/validate.middleware';
import { GenerateReportSchema } from '../../schemas/painSession.schema';

const router = Router();

router.use(requireSessionAuth);

// POST /v1/reports/:recordId/generate (F7: Generate Clinical Report)
router.post('/:recordId/generate', validateBody(GenerateReportSchema), ReportController.generate);

// GET /v1/reports/:id (Get Report Details)
router.get('/:id', ReportController.getById);

export default router;
