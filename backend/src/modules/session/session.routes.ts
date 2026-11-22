// backend/src/modules/session/session.routes.ts
import { Router } from 'express';
import { SessionController } from './session.controller';
import { validateBody, validateParams } from '../../middlewares/validate.middleware';
import { requireSessionAuth } from '../../middlewares/auth.middleware';
import { CreateSessionSchema, SessionIdParamSchema } from './session.schema';

const router = Router();

// POST /v1/sessions (Public - starts consultation session)
router.post('/', validateBody(CreateSessionSchema), SessionController.create);

// GET /v1/sessions/:id (Protected by Bearer Session Token)
router.get('/:id', validateParams(SessionIdParamSchema), requireSessionAuth, SessionController.getById);

export default router;
