// frontend/src/services/mockApi.ts
import { ApiResponse, CreateSessionResponse, SessionStatusResponse, PainLocation, TimingState, MovementItem } from '../types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockApi = {
  async createSession(language: 'ar' | 'fr' = 'ar'): Promise<ApiResponse<CreateSessionResponse>> {
    await delay(200);
    const sessionId = 'a90b4d91-5820-4e58-8687-3932822c9a10';
    const painRecordId = 'b11c5e92-6931-5f69-9798-4043933d0b21';
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString();

    return {
      success: true,
      data: {
        sessionId,
        sessionToken: 'pv_sess_9f8a32b14e910283c749102938475610',
        expiresAt,
        currentStep: 'SCREEN_2_LOCATION',
        painRecordId
      },
      error: null,
      meta: null
    };
  },

  async getSessionStatus(sessionId: string): Promise<ApiResponse<SessionStatusResponse>> {
    await delay(100);
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 6 * 60 * 60 * 1000).toISOString();

    return {
      success: true,
      data: {
        sessionId,
        status: 'in_progress',
        currentStep: 'SCREEN_2_LOCATION',
        painRecordId: 'b11c5e92-6931-5f69-9798-4043933d0b21',
        isCompleted: false,
        expiresAt
      },
      error: null,
      meta: null
    };
  },

  async getPainRecord(recordId: string): Promise<ApiResponse<any>> {
    await delay(100);
    return {
      success: true,
      data: {
        recordId,
        sessionId: 'a90b4d91-5820-4e58-8687-3932822c9a10',
        locations: [],
        timing: null,
        movements: [],
        hasAudioMemo: false,
        updatedAt: new Date().toISOString()
      },
      error: null,
      meta: null
    };
  },

  async updateLocations(recordId: string, locations: PainLocation[]): Promise<ApiResponse<any>> {
    await delay(150);
    return {
      success: true,
      data: {
        recordId,
        activeLocationsCount: locations.length,
        nextSuggestedStep: 'SCREEN_3_RADIATION'
      },
      error: null,
      meta: null
    };
  },

  async updateRadiations(recordId: string, radiations: any[]): Promise<ApiResponse<any>> {
    await delay(150);
    return {
      success: true,
      data: {
        recordId,
        updatedRadiations: radiations.length,
        nextSuggestedStep: 'SCREEN_4_INTENSITY'
      },
      error: null,
      meta: null
    };
  },

  async updateIntensities(recordId: string, intensities: any[]): Promise<ApiResponse<any>> {
    await delay(150);
    return {
      success: true,
      data: {
        recordId,
        colorMapApplied: true,
        nextSuggestedStep: 'SCREEN_5_NATURE'
      },
      error: null,
      meta: null
    };
  },

  async updateSensations(recordId: string, sensations: any[]): Promise<ApiResponse<any>> {
    await delay(150);
    return {
      success: true,
      data: {
        recordId,
        attachedSensationsCount: sensations.length,
        nextSuggestedStep: 'SCREEN_6_TIME_MOVEMENT'
      },
      error: null,
      meta: null
    };
  },

  async updateTiming(recordId: string, timing: TimingState): Promise<ApiResponse<any>> {
    await delay(150);
    return {
      success: true,
      data: {
        recordId,
        timelineConfigured: true
      },
      error: null,
      meta: null
    };
  },

  async updateMovements(recordId: string, movements: MovementItem[]): Promise<ApiResponse<any>> {
    await delay(150);
    return {
      success: true,
      data: {
        recordId,
        movementsMapped: movements.length,
        readyForReport: true,
        nextSuggestedStep: 'SCREEN_7_REPORT'
      },
      error: null,
      meta: null
    };
  },

  // Phase 4: Audio & Report Mocks
  async uploadAudio(recordId: string, durationSeconds: number): Promise<ApiResponse<any>> {
    await delay(200);
    return {
      success: true,
      data: {
        recordId,
        hasAudio: true,
        durationSeconds,
        audioVaultId: 'aud_vault_mock_123',
        message: 'تم حفظ الملاحظة الصوتية بنجاح'
      },
      error: null,
      meta: null
    };
  },

  async deleteAudio(recordId: string): Promise<ApiResponse<any>> {
    await delay(100);
    return {
      success: true,
      data: null,
      error: null,
      meta: null
    };
  },

  async mutateDimension(recordId: string, targetDimension: string, payload: any): Promise<ApiResponse<any>> {
    await delay(150);
    return {
      success: true,
      data: {
        recordId,
        modifiedDimension: targetDimension,
        reportSyncStatus: 'synced',
        updatedAt: new Date().toISOString()
      },
      error: null,
      meta: null
    };
  },

  async generateReport(recordId: string): Promise<ApiResponse<any>> {
    await delay(250);
    return {
      success: true,
      data: {
        reportId: 'rep_mock_9921',
        recordId,
        clinicCode: 'PV-4981',
        summary: {
          primaryPainZone: 'lower_back',
          maxIntensityLevel: 8,
          radiationPresent: true,
          dominantSensations: ['burning', 'throbbing'],
          peakHour: 7,
          severelyRestrictedMovements: ['bending']
        },
        visualSnapshotUrl: '/v1/reports/rep_mock_9921/snapshot',
        pdfDownloadUrl: '/v1/reports/rep_mock_9921/pdf',
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString()
      },
      error: null,
      meta: null
    };
  },

  async getReport(reportId: string): Promise<ApiResponse<any>> {
    await delay(150);
    return {
      success: true,
      data: {
        reportId,
        clinicCode: 'PV-4981',
        summary: {
          primaryPainZone: 'lower_back',
          maxIntensityLevel: 8,
          radiationPresent: true,
          dominantSensations: ['burning'],
          peakHour: 7,
          severelyRestrictedMovements: ['bending']
        },
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        isLocked: false
      },
      error: null,
      meta: null
    };
  },

  async getHealth(): Promise<ApiResponse<any>> {
    await delay(50);
    return {
      success: true,
      data: {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          database: 'connected (mock)',
          audioStorage: 'available (mock)',
          pdfRenderer: 'ready (mock)'
        }
      },
      error: null,
      meta: null
    };
  },

  async getSystemConfig(): Promise<ApiResponse<any>> {
    await delay(50);
    return {
      success: true,
      data: {
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
        maxAudioDurationSeconds: 45,
        sessionDurationHours: 6,
        reportDurationHours: 48
      },
      error: null,
      meta: null
    };
  }
};
