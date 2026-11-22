// backend/src/utils/responseFormatter.ts
import { ApiResponse, ApiError, ApiMeta } from '../types/api.types';

export function formatSuccess<T>(data: T, meta: ApiMeta | null = null): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
    meta
  };
}

export function formatError(
  code: string,
  message: string,
  fields?: Record<string, string>,
  meta: ApiMeta | null = null
): ApiResponse<null> {
  const errorObj: ApiError = {
    code,
    message
  };

  if (fields && Object.keys(fields).length > 0) {
    errorObj.fields = fields;
  }

  return {
    success: false,
    data: null,
    error: errorObj,
    meta
  };
}
