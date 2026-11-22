// backend/src/modules/painRecord/painRecord.routes.ts
import { Router } from 'express';
import { PainRecordController } from './painRecord.controller';
import { requireSessionAuth } from '../../middlewares/auth.middleware';
import { validateBody, validateParams } from '../../middlewares/validate.middleware';
import {
  RecordIdParamSchema,
  UpdateLocationsPayloadSchema,
  UpdateRadiationsPayloadSchema,
  UpdateIntensitiesPayloadSchema,
  UpdateSensationsPayloadSchema,
  UpdateTimingPayloadSchema,
  UpdateMovementsPayloadSchema,
  DimensionMutationSchema
} from './painRecord.schema';

const router = Router();

// All pain record endpoints require Bearer session authentication
router.use(requireSessionAuth);

// GET /v1/pain-records/:id (F1-F6 complete record)
router.get('/:id', validateParams(RecordIdParamSchema), PainRecordController.getById);

// PUT /v1/pain-records/:id/location (F1: Location & View)
router.put(
  '/:id/location',
  validateParams(RecordIdParamSchema),
  validateBody(UpdateLocationsPayloadSchema),
  PainRecordController.updateLocation
);

// PUT /v1/pain-records/:id/radiation (F2: Radiation Vector)
router.put(
  '/:id/radiation',
  validateParams(RecordIdParamSchema),
  validateBody(UpdateRadiationsPayloadSchema),
  PainRecordController.updateRadiation
);

// PUT /v1/pain-records/:id/intensity (F3: Intensity & Color)
router.put(
  '/:id/intensity',
  validateParams(RecordIdParamSchema),
  validateBody(UpdateIntensitiesPayloadSchema),
  PainRecordController.updateIntensity
);

// PUT /v1/pain-records/:id/nature (F4: Sensations & Nature)
router.put(
  '/:id/nature',
  validateParams(RecordIdParamSchema),
  validateBody(UpdateSensationsPayloadSchema),
  PainRecordController.updateNature
);

// PUT /v1/pain-records/:id/timing (F5: 24h Timeline)
router.put(
  '/:id/timing',
  validateParams(RecordIdParamSchema),
  validateBody(UpdateTimingPayloadSchema),
  PainRecordController.updateTiming
);

// PUT /v1/pain-records/:id/movements (F6: Provocative Movements)
router.put(
  '/:id/movements',
  validateParams(RecordIdParamSchema),
  validateBody(UpdateMovementsPayloadSchema),
  PainRecordController.updateMovements
);

// PATCH /v1/pain-records/:id/dimension (F8: One-Touch In-Place Mutation)
router.patch(
  '/:id/dimension',
  validateParams(RecordIdParamSchema),
  validateBody(DimensionMutationSchema),
  PainRecordController.mutateDimension
);

export default router;
