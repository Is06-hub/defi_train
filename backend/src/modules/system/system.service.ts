// backend/src/modules/system/system.service.ts
import { HealthCheckData, SystemConfigData } from '../../types/report.types';
import { ENV } from '../../config/env.config';

export class SystemService {
  public static getHealth(): HealthCheckData {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        audioStorage: 'available',
        pdfRenderer: 'ready'
      }
    };
  }

  public static getConfig(): SystemConfigData {
    return {
      sensations: [
        { id: 'burning', labelAr: 'حرقان', icon: 'flame', color: '#FF4500' },
        { id: 'pricking', labelAr: 'وخز / تنميل', icon: 'pin', color: '#FFD700' },
        { id: 'throbbing', labelAr: 'نبض / خفقان', icon: 'pulse', color: '#9400D3' },
        { id: 'stabbing', labelAr: 'طعن حاد', icon: 'knife', color: '#DC143C' },
        { id: 'heavy_ache', labelAr: 'ثقل / ضغط', icon: 'weight', color: '#4682B4' }
      ],
      movements: [
        { id: 'bending', labelAr: 'الانحناء للأمام', icon: 'posture_bend' },
        { id: 'raising_arm', labelAr: 'رفع الذراع للأعلى', icon: 'posture_arm' },
        { id: 'walking', labelAr: 'المشي', icon: 'posture_walk' },
        { id: 'sitting', labelAr: 'الجلوس لفترة طويلة', icon: 'posture_sit' },
        { id: 'twisting', labelAr: 'التفاف الجذع', icon: 'posture_twist' }
      ],
      maxAudioDurationSeconds: ENV.MAX_AUDIO_DURATION_SECONDS,
      sessionDurationHours: ENV.SESSION_TTL_HOURS,
      reportDurationHours: ENV.REPORT_TTL_HOURS
    };
  }
}
