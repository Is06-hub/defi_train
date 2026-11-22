// frontend/src/types/index.ts
export type LanguageCode = 'ar' | 'fr';

export type StepName =
  | 'SCREEN_1_WELCOME'
  | 'SCREEN_2_LOCATION'
  | 'SCREEN_3_RADIATION'
  | 'SCREEN_4_INTENSITY'
  | 'SCREEN_5_NATURE'
  | 'SCREEN_6_TIME_MOVEMENT'
  | 'SCREEN_7_REPORT';

export interface Coordinates {
  x: number; // 0.00 to 100.00 (%)
  y: number; // 0.00 to 100.00 (%)
  radius?: number;
}

export interface PainLocation {
  locationId: string;
  bodyPart: string;
  bodyView: 'front' | 'back';
  coordinates: Coordinates;
  intensity?: {
    level: number;
    colorHex: string;
    gradientSpread?: number;
  };
  radiation?: {
    hasRadiation: boolean;
    endCoordinates?: Coordinates;
    pathVector?: string;
  };
  sensations?: Array<{
    type: string;
    iconId: string;
    placedCoordinates?: Coordinates;
    placedAt?: Coordinates;
  }>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: {
    code: string;
    message: string;
    fields?: Record<string, string>;
  } | null;
  meta: any | null;
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
  status: 'in_progress' | 'completed' | 'expired';
  currentStep: StepName;
  painRecordId: string;
  isCompleted: boolean;
  expiresAt: string;
}

export interface TimingState {
  onsetHours: number[];
  isConstant: boolean;
  frequency: string;
  peakHours?: number[];
}

export interface MovementItem {
  movementId: string;
  affectedLocationId: string;
  severity: 'mild' | 'moderate' | 'severe';
}
