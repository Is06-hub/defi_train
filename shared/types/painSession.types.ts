// shared/types/painSession.types.ts
// تعريفات نماذج الجلسات وسجلات أبعاد الألم

export type LanguageCode = 'ar' | 'fr';

export interface Coordinates {
  x: number; // 0.00 to 100.00 (%)
  y: number; // 0.00 to 100.00 (%)
  radius?: number;
}

export interface ClientMetadata {
  deviceType?: 'mobile' | 'tablet' | 'desktop';
  touchPoints?: number;
  screenWidth?: number;
  screenHeight?: number;
}

export type StepName =
  | 'SCREEN_1_WELCOME'
  | 'SCREEN_2_LOCATION'
  | 'SCREEN_3_RADIATION'
  | 'SCREEN_4_INTENSITY'
  | 'SCREEN_5_NATURE'
  | 'SCREEN_6_TIME_MOVEMENT'
  | 'SCREEN_7_REPORT';

export type SessionStatus = 'in_progress' | 'completed' | 'expired';

export interface Session {
  id: string;
  sessionToken: string;
  status: SessionStatus;
  currentStep: StepName;
  language: LanguageCode;
  clientMetadata?: ClientMetadata;
  createdAt: string;
  expiresAt: string;
  painRecordId: string;
}

export interface CreateSessionDTO {
  language?: LanguageCode;
  clientMetadata?: ClientMetadata;
}

export interface CreateSessionResponse {
  sessionId: string;
  sessionToken: string;
  expiresAt: string;
  currentStep: StepName;
  painRecordId: string;
}

export interface SessionStatusResponse {
  sessionId: string;
  status: SessionStatus;
  currentStep: StepName;
  painRecordId: string;
  isCompleted: boolean;
  expiresAt: string;
}

export type BodyView = 'front' | 'back';

export interface PainLocationDTO {
  locationId: string;
  bodyPart: string;
  bodyView: BodyView;
  coordinates: Coordinates;
  intensity?: IntensityDTO;
  radiation?: RadiationDTO;
  sensations?: SensationDTO[];
}

export interface IntensityDTO {
  locationId: string;
  level: number; // 1 to 10
  colorHex: string;
  gradientSpread?: number;
  isSharpCenter?: boolean;
}

export interface RadiationDTO {
  locationId: string;
  hasRadiation: boolean;
  endCoordinates?: Coordinates;
  pathVector?: string;
  direction?: string;
  directionDescription?: string;
}

export type SensationType = 'burning' | 'pricking' | 'throbbing' | 'stabbing' | 'heavy_ache' | 'electric_shock';

export interface SensationDTO {
  locationId: string;
  type: SensationType | string;
  iconId: string;
  placedCoordinates?: Coordinates;
  placedAt?: Coordinates;
}

export interface TimelineMarker {
  hour: number;
  markerType?: string;
  label?: string;
  notes?: string;
}

export interface TimingDTO {
  onsetHours: number[]; // 0 to 23
  isConstant: boolean;
  frequency: string;
  peakHours?: number[];
  pattern?: string;
  timelineMarkers?: TimelineMarker[];
}

export interface MovementDTO {
  movementId: string;
  affectedLocationId: string;
  severity?: 'mild' | 'moderate' | 'severe';
  severityRating?: 'mild' | 'moderate' | 'severe';
}

export interface PainRecord {
  id: string;
  sessionId: string;
  locations: PainLocationDTO[];
  intensities?: IntensityDTO[];
  radiations?: RadiationDTO[];
  sensations?: SensationDTO[];
  timing?: TimingDTO;
  movements?: MovementDTO[];
  audioMemo?: {
    hasAudio: boolean;
    durationSeconds?: number;
    audioVaultId?: string;
  };
  createdAt: string;
  updatedAt: string;
}
