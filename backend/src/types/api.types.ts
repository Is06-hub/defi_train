// backend/src/types/api.types.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
  meta: ApiMeta | null;
}

export interface ApiError {
  code: ApiErrorCode | string;
  message: string;
  fields?: Record<string, string>;
}

export interface ApiMeta {
  timestamp?: string;
  requestId?: string;
  page?: number;
  limit?: number;
  total?: number;
  [key: string]: any;
}

export type ApiErrorCode =
  | 'SESSION_EXPIRED'
  | 'SESSION_NOT_FOUND'
  | 'LOCATION_NOT_FOUND'
  | 'INVALID_COORDINATES'
  | 'INVALID_INTENSITY_RANGE'
  | 'AUDIO_TOO_LONG'
  | 'AUDIO_EMPTY'
  | 'INVALID_CLINIC_CODE'
  | 'REPORT_LOCKED'
  | 'RATE_LIMIT_EXCEEDED'
  | 'VALIDATION_ERROR'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'INTERNAL_ERROR';
