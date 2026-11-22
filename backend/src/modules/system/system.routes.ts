// backend/src/modules/system/system.routes.ts
import { Router } from 'express';
import { SystemController } from './system.controller';

const router = Router();

// GET /v1/health
router.get('/health', SystemController.getHealth);

// GET /v1/system/config
router.get('/system/config', SystemController.getConfig);

export default router;
