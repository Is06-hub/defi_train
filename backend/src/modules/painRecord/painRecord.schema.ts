// backend/src/modules/painRecord/painRecord.schema.ts
import { z } from 'zod';
import {
  UpdateLocationsPayloadSchema,
  UpdateRadiationsPayloadSchema,
  UpdateIntensitiesPayloadSchema,
  UpdateSensationsPayloadSchema,
  UpdateTimingPayloadSchema,
  UpdateMovementsPayloadSchema,
  DimensionMutationSchema
} from '../../schemas/painSession.schema';

export const RecordIdParamSchema = z.object({
  id: z.string().min(1, 'معرف سجل الألم مطلوب')
});

export {
  UpdateLocationsPayloadSchema,
  UpdateRadiationsPayloadSchema,
  UpdateIntensitiesPayloadSchema,
  UpdateSensationsPayloadSchema,
  UpdateTimingPayloadSchema,
  UpdateMovementsPayloadSchema,
  DimensionMutationSchema
};
