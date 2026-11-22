// backend/src/types/report.types.ts

export interface SensationConfigItem {
  id: string;
  labelAr: string;
  icon: string;
  color: string;
}

export interface MovementConfigItem {
  id: string;
  labelAr: string;
  icon: string;
}

export interface SystemConfigData {
  sensations: SensationConfigItem[];
  movements: MovementConfigItem[];
  maxAudioDurationSeconds: number;
  sessionDurationHours: number;
  reportDurationHours: number;
}

export interface HealthCheckData {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    database: string;
    audioStorage: string;
    pdfRenderer: string;
  };
}

export interface ClinicalReportSummary {
  primaryPainZone: string;
  maxIntensityLevel: number;
  radiationPresent: boolean;
  dominantSensations: string[];
  peakHour?: number;
  severelyRestrictedMovements: string[];
}

export interface ClinicalReport {
  id: string;
  recordId: string;
  clinicCode: string; // e.g. "PV-4981"
  doctorShareHash?: string;
  summary: ClinicalReportSummary;
  visualSnapshotUrl?: string;
  pdfDownloadUrl?: string;
  isLocked: boolean;
  createdAt: string;
  expiresAt: string;
}

export interface GenerateReportDTO {
  includeAudio?: boolean;
  clientRenderedSnapshot?: string;
}

export interface AudioMemoUploadResponse {
  recordId: string;
  hasAudio: boolean;
  durationSeconds: number;
  audioVaultId: string;
  message: string;
}

export interface DimensionMutationDTO {
  targetDimension: 'intensity' | 'location' | 'radiation' | 'nature' | 'timing' | 'movements';
  payload: any;
}

export interface DimensionMutationResponse {
  recordId: string;
  modifiedDimension: string;
  reportSyncStatus: 'synced' | 'pending';
  updatedAt: string;
}
