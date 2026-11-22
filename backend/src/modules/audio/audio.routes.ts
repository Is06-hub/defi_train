// backend/src/modules/audio/audio.routes.ts
import { Router } from 'express';
import { AudioController } from './audio.controller';
import { requireSessionAuth } from '../../middlewares/auth.middleware';
import { validateParams } from '../../middlewares/validate.middleware';
import { RecordIdParamSchema } from '../painRecord/painRecord.schema';

const router = Router();

router.use(requireSessionAuth);

// POST /v1/pain-records/:id/audio (Upload voice memo <= 45s)
router.post('/:id/audio', validateParams(RecordIdParamSchema), AudioController.upload);

// DELETE /v1/pain-records/:id/audio (Delete voice memo -> 204 No Content)
router.delete('/:id/audio', validateParams(RecordIdParamSchema), AudioController.delete);

export default router;
