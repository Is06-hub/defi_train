// backend/src/modules/audio/audio.service.ts
import { db } from '../../config/database.config';
import { AppError } from '../../middlewares/errorHandler.middleware';
import { generateUUID } from '../../utils/crypto.util';
import { ENV } from '../../config/env.config';

export class AudioService {
  public static async uploadAudio(recordId: string, durationSeconds: number, audioBuffer?: Buffer | string) {
    const record = db.getPainRecordById(recordId);
    if (!record) {
      throw new AppError(404, 'RECORD_NOT_FOUND', 'سجل الألم المطلوب غير موجود');
    }

    if (durationSeconds > ENV.MAX_AUDIO_DURATION_SECONDS) {
      throw new AppError(413, 'AUDIO_TOO_LONG', `مدة التسجيل الصوتي تتجاوز الحد الأقصى المسموح به (${ENV.MAX_AUDIO_DURATION_SECONDS} ثانية)`);
    }

    if (durationSeconds <= 0) {
      throw new AppError(400, 'AUDIO_EMPTY', 'الملف الصوتي فارغ أو مدته غير صالحة');
    }

    const audioVaultId = `aud_vault_${generateUUID().replace(/-/g, '').slice(0, 12)}`;

    db.updatePainRecord(recordId, {
      audioMemo: {
        hasAudio: true,
        durationSeconds,
        audioVaultId
      }
    });

    return {
      recordId,
      hasAudio: true,
      durationSeconds,
      audioVaultId,
      message: 'تم حفظ الملاحظة الصوتية بنجاح'
    };
  }

  public static async deleteAudio(recordId: string) {
    const record = db.getPainRecordById(recordId);
    if (!record) {
      throw new AppError(404, 'RECORD_NOT_FOUND', 'سجل الألم المطلوب غير موجود');
    }

    db.updatePainRecord(recordId, {
      audioMemo: {
        hasAudio: false
      }
    });

    return true;
  }
}
