// backend/src/modules/painRecord/painRecord.service.ts
import { db } from '../../config/database.config';
import { AppError } from '../../middlewares/errorHandler.middleware';
import {
  PainLocationDTO,
  RadiationDTO,
  IntensityDTO,
  SensationDTO,
  TimingDTO,
  MovementDTO
} from '../../types/painSession.types';

export class PainRecordService {
  public static async getRecordById(recordId: string) {
    const record = db.getPainRecordById(recordId);
    if (!record) {
      throw new AppError(404, 'RECORD_NOT_FOUND', 'سجل الألم المطلوب غير موجود');
    }

    // Merge intensities, radiations, and sensations into locations
    const mergedLocations = record.locations.map((loc) => {
      const locIntensity = record.intensities?.find((i) => i.locationId === loc.locationId);
      const locRadiation = record.radiations?.find((r) => r.locationId === loc.locationId);
      const locSensations = record.sensations?.filter((s) => s.locationId === loc.locationId) || [];

      return {
        ...loc,
        intensity: locIntensity || loc.intensity,
        radiation: locRadiation || loc.radiation,
        sensations: locSensations.length > 0 ? locSensations : loc.sensations || []
      };
    });

    return {
      recordId: record.id,
      sessionId: record.sessionId,
      locations: mergedLocations,
      timing: record.timing || null,
      movements: record.movements || [],
      hasAudioMemo: Boolean(record.audioMemo?.hasAudio),
      updatedAt: record.updatedAt
    };
  }

  public static async updateLocations(recordId: string, locations: PainLocationDTO[]) {
    const record = db.getPainRecordById(recordId);
    if (!record) {
      throw new AppError(404, 'RECORD_NOT_FOUND', 'سجل الألم المطلوب غير موجود');
    }

    db.updatePainRecord(recordId, { locations });
    db.updateSession(record.sessionId, { currentStep: 'SCREEN_3_RADIATION' });

    return {
      recordId,
      activeLocationsCount: locations.length,
      nextSuggestedStep: 'SCREEN_3_RADIATION'
    };
  }

  public static async updateRadiations(recordId: string, radiations: RadiationDTO[]) {
    const record = db.getPainRecordById(recordId);
    if (!record) {
      throw new AppError(404, 'RECORD_NOT_FOUND', 'سجل الألم المطلوب غير موجود');
    }

    // Verify locations exist
    for (const rad of radiations) {
      const locExists = record.locations.some((l) => l.locationId === rad.locationId);
      if (!locExists) {
        throw new AppError(404, 'LOCATION_NOT_FOUND', `موضع الألم ${rad.locationId} غير مسجل`);
      }
    }

    db.updatePainRecord(recordId, { radiations });
    db.updateSession(record.sessionId, { currentStep: 'SCREEN_4_INTENSITY' });

    return {
      recordId,
      updatedRadiations: radiations.length,
      nextSuggestedStep: 'SCREEN_4_INTENSITY'
    };
  }

  public static async updateIntensities(recordId: string, intensities: IntensityDTO[]) {
    const record = db.getPainRecordById(recordId);
    if (!record) {
      throw new AppError(404, 'RECORD_NOT_FOUND', 'سجل الألم المطلوب غير موجود');
    }

    // Validate intensity level 1-10
    for (const item of intensities) {
      if (item.level < 1 || item.level > 10) {
        throw new AppError(400, 'INVALID_INTENSITY_RANGE', 'يجب أن تكون شدة الألم بين 1 و 10');
      }
      const locExists = record.locations.some((l) => l.locationId === item.locationId);
      if (!locExists) {
        throw new AppError(404, 'LOCATION_NOT_FOUND', `موضع الألم ${item.locationId} غير مسجل`);
      }
    }

    db.updatePainRecord(recordId, { intensities });
    db.updateSession(record.sessionId, { currentStep: 'SCREEN_5_NATURE' });

    return {
      recordId,
      colorMapApplied: true,
      nextSuggestedStep: 'SCREEN_5_NATURE'
    };
  }

  public static async updateSensations(recordId: string, sensations: SensationDTO[]) {
    const record = db.getPainRecordById(recordId);
    if (!record) {
      throw new AppError(404, 'RECORD_NOT_FOUND', 'سجل الألم المطلوب غير موجود');
    }

    for (const sens of sensations) {
      const locExists = record.locations.some((l) => l.locationId === sens.locationId);
      if (!locExists) {
        throw new AppError(404, 'LOCATION_NOT_FOUND', `موضع الألم ${sens.locationId} غير مسجل`);
      }
    }

    db.updatePainRecord(recordId, { sensations });
    db.updateSession(record.sessionId, { currentStep: 'SCREEN_6_TIME_MOVEMENT' });

    return {
      recordId,
      attachedSensationsCount: sensations.length,
      nextSuggestedStep: 'SCREEN_6_TIME_MOVEMENT'
    };
  }

  public static async updateTiming(recordId: string, timing: TimingDTO) {
    const record = db.getPainRecordById(recordId);
    if (!record) {
      throw new AppError(404, 'RECORD_NOT_FOUND', 'سجل الألم المطلوب غير موجود');
    }

    db.updatePainRecord(recordId, { timing });

    return {
      recordId,
      timelineConfigured: true
    };
  }

  public static async updateMovements(recordId: string, movements: MovementDTO[]) {
    const record = db.getPainRecordById(recordId);
    if (!record) {
      throw new AppError(404, 'RECORD_NOT_FOUND', 'سجل الألم المطلوب غير موجود');
    }

    db.updatePainRecord(recordId, { movements });
    db.updateSession(record.sessionId, { currentStep: 'SCREEN_7_REPORT' });

    return {
      recordId,
      movementsMapped: movements.length,
      readyForReport: true,
      nextSuggestedStep: 'SCREEN_7_REPORT'
    };
  }

  // F8: One-Touch Dimension In-Place Mutation
  public static async mutateDimension(recordId: string, targetDimension: string, payload: any) {
    const record = db.getPainRecordById(recordId);
    if (!record) {
      throw new AppError(404, 'RECORD_NOT_FOUND', 'سجل الألم المطلوب غير موجود');
    }

    const updates: Partial<any> = {};

    switch (targetDimension) {
      case 'intensity':
        if (Array.isArray(payload)) {
          updates.intensities = payload;
        } else if (payload && payload.locationId) {
          const current = record.intensities || [];
          const existingIdx = current.findIndex((i) => i.locationId === payload.locationId);
          if (existingIdx >= 0) {
            current[existingIdx] = { ...current[existingIdx], ...payload };
            updates.intensities = current;
          } else {
            updates.intensities = [...current, payload];
          }
        }
        break;

      case 'location':
        updates.locations = Array.isArray(payload) ? payload : [payload];
        break;

      case 'radiation':
        updates.radiations = Array.isArray(payload) ? payload : [payload];
        break;

      case 'nature':
        updates.sensations = Array.isArray(payload) ? payload : [payload];
        break;

      case 'timing':
        updates.timing = payload;
        break;

      case 'movements':
        updates.movements = Array.isArray(payload) ? payload : [payload];
        break;

      default:
        throw new AppError(400, 'VALIDATION_ERROR', `البعد غير صالح: ${targetDimension}`);
    }

    const updated = db.updatePainRecord(recordId, updates);

    return {
      recordId,
      modifiedDimension: targetDimension,
      reportSyncStatus: 'synced',
      updatedAt: updated?.updatedAt || new Date().toISOString()
    };
  }
}
