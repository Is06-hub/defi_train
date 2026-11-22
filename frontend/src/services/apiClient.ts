// frontend/src/services/apiClient.ts
import { ApiResponse, CreateSessionResponse, SessionStatusResponse, PainLocation, TimingState, MovementItem } from '../types';
import { mockApi } from './mockApi';

const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/v1';

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
  token?: string | null
): Promise<ApiResponse<T>> {
  const url = `${BASE_URL}${endpoint}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>)
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    });

    if (res.status === 204) {
      return { success: true, data: null, error: null, meta: null };
    }

    const data: ApiResponse<T> = await res.json();
    return data;
  } catch (err: any) {
    if (import.meta.env.DEV) {
      console.warn(`[apiClient] Fetch failed for ${url}, fallback check...`, err.message);
    }

    return {
      success: false,
      data: null,
      error: {
        code: 'NETWORK_ERROR',
        message: 'تعذر الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.'
      },
      meta: null
    };
  }
}

export const apiClient = {
  // --- Sessions (Phase 1) ---
  async createSession(language: 'ar' | 'fr' = 'ar'): Promise<ApiResponse<CreateSessionResponse>> {
    if (USE_MOCKS) {
      return mockApi.createSession(language);
    }

    const clientMetadata = {
      deviceType: window.innerWidth < 768 ? 'mobile' : window.innerWidth < 1024 ? 'tablet' : 'desktop',
      touchPoints: navigator.maxTouchPoints || 0,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height
    };

    const res = await request<CreateSessionResponse>('/sessions', {
      method: 'POST',
      body: JSON.stringify({ language, clientMetadata })
    });

    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.createSession(language);
    }

    return res;
  },

  async getSessionStatus(sessionId: string, token: string): Promise<ApiResponse<SessionStatusResponse>> {
    if (USE_MOCKS) {
      return mockApi.getSessionStatus(sessionId);
    }

    const res = await request<SessionStatusResponse>(`/sessions/${sessionId}`, { method: 'GET' }, token);
    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.getSessionStatus(sessionId);
    }

    return res;
  },

  // --- Pain Records (Phase 2 & Phase 3) ---
  async getPainRecord(recordId: string, token?: string | null): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.getPainRecord(recordId);
    }
    const res = await request<any>(`/pain-records/${recordId}`, { method: 'GET' }, token);
    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.getPainRecord(recordId);
    }
    return res;
  },

  async updateLocations(recordId: string, locations: PainLocation[], token?: string | null): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.updateLocations(recordId, locations);
    }
    const res = await request<any>(
      `/pain-records/${recordId}/location`,
      {
        method: 'PUT',
        body: JSON.stringify({ locations })
      },
      token
    );
    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.updateLocations(recordId, locations);
    }
    return res;
  },

  async updateRadiations(recordId: string, radiations: any[], token?: string | null): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.updateRadiations(recordId, radiations);
    }
    const res = await request<any>(
      `/pain-records/${recordId}/radiation`,
      {
        method: 'PUT',
        body: JSON.stringify({ radiations })
      },
      token
    );
    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.updateRadiations(recordId, radiations);
    }
    return res;
  },

  async updateIntensities(recordId: string, intensities: any[], token?: string | null): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.updateIntensities(recordId, intensities);
    }
    const res = await request<any>(
      `/pain-records/${recordId}/intensity`,
      {
        method: 'PUT',
        body: JSON.stringify({ intensities })
      },
      token
    );
    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.updateIntensities(recordId, intensities);
    }
    return res;
  },

  async updateSensations(recordId: string, sensations: any[], token?: string | null): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.updateSensations(recordId, sensations);
    }
    const res = await request<any>(
      `/pain-records/${recordId}/nature`,
      {
        method: 'PUT',
        body: JSON.stringify({ sensations })
      },
      token
    );
    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.updateSensations(recordId, sensations);
    }
    return res;
  },

  async updateTiming(recordId: string, timing: TimingState, token?: string | null): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.updateTiming(recordId, timing);
    }
    const res = await request<any>(
      `/pain-records/${recordId}/timing`,
      {
        method: 'PUT',
        body: JSON.stringify({ timing })
      },
      token
    );
    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.updateTiming(recordId, timing);
    }
    return res;
  },

  async updateMovements(recordId: string, movements: MovementItem[], token?: string | null): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.updateMovements(recordId, movements);
    }
    const res = await request<any>(
      `/pain-records/${recordId}/movements`,
      {
        method: 'PUT',
        body: JSON.stringify({ movements })
      },
      token
    );
    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.updateMovements(recordId, movements);
    }
    return res;
  },

  // --- Phase 4: In-Place Mutation, Audio & Reports ---
  async mutateDimension(
    recordId: string,
    targetDimension: string,
    payload: any,
    token?: string | null
  ): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.mutateDimension(recordId, targetDimension, payload);
    }
    const res = await request<any>(
      `/pain-records/${recordId}/dimension`,
      {
        method: 'PATCH',
        body: JSON.stringify({ targetDimension, payload })
      },
      token
    );
    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.mutateDimension(recordId, targetDimension, payload);
    }
    return res;
  },

  async uploadAudio(
    recordId: string,
    durationSeconds: number,
    token?: string | null
  ): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.uploadAudio(recordId, durationSeconds);
    }
    const res = await request<any>(
      `/pain-records/${recordId}/audio`,
      {
        method: 'POST',
        body: JSON.stringify({ durationSeconds })
      },
      token
    );
    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.uploadAudio(recordId, durationSeconds);
    }
    return res;
  },

  async deleteAudio(recordId: string, token?: string | null): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.deleteAudio(recordId);
    }
    return request<any>(`/pain-records/${recordId}/audio`, { method: 'DELETE' }, token);
  },

  async generateReport(
    recordId: string,
    options: { includeAudio?: boolean; clientRenderedSnapshot?: string } = {},
    token?: string | null
  ): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.generateReport(recordId);
    }
    const res = await request<any>(
      `/reports/${recordId}/generate`,
      {
        method: 'POST',
        body: JSON.stringify(options)
      },
      token
    );
    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.generateReport(recordId);
    }
    return res;
  },

  async getReport(reportId: string, token?: string | null): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.getReport(reportId);
    }
    const res = await request<any>(`/reports/${reportId}`, { method: 'GET' }, token);
    if (!res.success && res.error?.code === 'NETWORK_ERROR') {
      return mockApi.getReport(reportId);
    }
    return res;
  },

  // --- System ---
  async getHealth(): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.getHealth();
    }
    return request<any>('/health', { method: 'GET' });
  },

  async getSystemConfig(): Promise<ApiResponse<any>> {
    if (USE_MOCKS) {
      return mockApi.getSystemConfig();
    }
    return request<any>('/system/config', { method: 'GET' });
  }
};
