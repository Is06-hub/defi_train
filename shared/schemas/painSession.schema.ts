// shared/schemas/painSession.schema.ts
// مخططات Zod للتحقق من المدخلات مطابقة لعقد api-contract.md

import { z } from 'zod';

export const CoordinatesSchema = z.object({
  x: z.number().min(0).max(100),
  y: z.number().min(0).max(100),
  radius: z.number().min(1).max(30).default(5)
});

export const ClientMetadataSchema = z.object({
  deviceType: z.enum(['mobile', 'tablet', 'desktop']).optional(),
  touchPoints: z.number().int().min(0).optional(),
  screenWidth: z.number().int().positive().optional(),
  screenHeight: z.number().int().positive().optional()
}).optional();

export const CreateSessionSchema = z.object({
  language: z.enum(['ar', 'fr']).default('ar'),
  clientMetadata: ClientMetadataSchema
});

export const PainLocationDTOSchema = z.object({
  locationId: z.string().min(3),
  bodyPart: z.string().min(2),
  bodyView: z.enum(['front', 'back']),
  coordinates: CoordinatesSchema
});

export const UpdateLocationsPayloadSchema = z.object({
  locations: z.array(PainLocationDTOSchema).min(1, 'يجب تحديد موضع ألم واحد على الأقل')
});

export const RadiationDTOSchema = z.object({
  locationId: z.string().min(3),
  hasRadiation: z.boolean(),
  endCoordinates: CoordinatesSchema.optional(),
  pathVector: z.string().optional(),
  direction: z.string().optional()
});

export const UpdateRadiationsPayloadSchema = z.object({
  radiations: z.array(RadiationDTOSchema)
});

export const IntensityDTOSchema = z.object({
  locationId: z.string().min(3),
  level: z.number().int().min(1).max(10),
  colorHex: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  gradientSpread: z.number().min(1).max(50).default(10),
  isSharpCenter: z.boolean().default(false)
});

export const UpdateIntensitiesPayloadSchema = z.object({
  intensities: z.array(IntensityDTOSchema)
});

export const SensationDTOSchema = z.object({
  locationId: z.string().min(3),
  type: z.enum(['burning', 'pricking', 'throbbing', 'stabbing', 'heavy_ache', 'electric_shock']),
  iconId: z.string(),
  placedCoordinates: CoordinatesSchema.optional()
});

export const UpdateSensationsPayloadSchema = z.object({
  sensations: z.array(SensationDTOSchema)
});

export const TimelineMarkerSchema = z.object({
  hour: z.number().int().min(0).max(23),
  markerType: z.string().optional(),
  label: z.string().optional(),
  notes: z.string().optional()
});

export const TimingDTOSchema = z.object({
  onsetHours: z.array(z.number().int().min(0).max(23)),
  isConstant: z.boolean().default(false),
  frequency: z.string().default('daily'),
  peakHours: z.array(z.number().int().min(0).max(23)).optional(),
  timelineMarkers: z.array(TimelineMarkerSchema).optional(),
  pattern: z.string().optional()
});

export const UpdateTimingPayloadSchema = z.object({
  timing: TimingDTOSchema
});

export const MovementDTOSchema = z.object({
  movementId: z.string().min(2),
  affectedLocationId: z.string().min(3),
  severity: z.enum(['mild', 'moderate', 'severe']).optional(),
  severityRating: z.enum(['mild', 'moderate', 'severe']).optional()
});

export const UpdateMovementsPayloadSchema = z.object({
  movements: z.array(MovementDTOSchema)
});

// Phase 4 Schemas
export const DimensionMutationSchema = z.object({
  targetDimension: z.enum(['intensity', 'location', 'radiation', 'nature', 'timing', 'movements']),
  payload: z.any()
});

export const GenerateReportSchema = z.object({
  includeAudio: z.boolean().default(true),
  clientRenderedSnapshot: z.string().optional()
});

export const AudioUploadSchema = z.object({
  durationSeconds: z.number().int().min(1).max(45, 'مدة التسجيل الصوتي تجاوزت الحد الأقصى (45 ثانية)'),
  audioBase64: z.string().optional()
});
