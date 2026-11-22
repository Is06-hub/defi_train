// frontend/src/store/usePainSessionStore.ts
import { create } from 'zustand';
import { StepName, LanguageCode, PainLocation, TimingState, MovementItem } from '../types';
import { apiClient } from '../services/apiClient';

export type { StepName };

interface PainSessionState {
  sessionId: string | null;
  sessionToken: string | null;
  painRecordId: string | null;
  currentStep: StepName;
  language: LanguageCode;
  activeView: 'front' | 'back';
  locations: PainLocation[];
  activeLocationId: string | null;
  timing: TimingState;
  movements: MovementItem[];
  isSubmitting: boolean;
  errorMessage: string | null;

  // Phase 4 State
  audioMemo: {
    hasAudio: boolean;
    durationSeconds: number;
    audioVaultId?: string;
  };
  reportData: any | null;
  editingDimension: string | null;

  // General Actions
  setLanguage: (lang: LanguageCode) => void;
  setStep: (step: StepName) => void;
  toggleView: () => void;
  setView: (view: 'front' | 'back') => void;
  startSession: () => Promise<boolean>;
  resetSession: () => void;
  clearError: () => void;

  // F1 - F4 Actions
  addLocation: (bodyPart: string, coordinates: { x: number; y: number }) => void;
  removeLocation: (locationId: string) => void;
  setActiveLocation: (locationId: string | null) => void;
  setRadiation: (locationId: string, hasRadiation: boolean, endCoords?: { x: number; y: number }, path?: string) => void;
  setIntensity: (locationId: string, level: number, colorHex: string) => void;
  attachSensation: (locationId: string, sensationType: string, iconId: string) => void;
  removeSensation: (locationId: string, sensationType: string) => void;

  // F5 - F6 Actions
  setTiming: (timing: Partial<TimingState>) => void;
  toggleHour: (hour: number) => void;
  setFrequency: (frequency: string) => void;
  toggleMovement: (movementId: string, severity?: 'mild' | 'moderate' | 'severe') => void;

  // Phase 4: F7, F8 & Audio Actions
  quickEditDimension: (dimension: 'location' | 'radiation' | 'intensity' | 'nature' | 'timing' | 'movements') => void;
  returnToReport: () => void;
  mutateDimensionInPlace: (targetDimension: string, payload: any) => Promise<boolean>;
  recordAudioMemo: (durationSeconds: number) => Promise<boolean>;
  deleteAudioMemo: () => Promise<boolean>;
  generateClinicalReport: () => Promise<boolean>;

  // Submissions
  submitLocations: () => Promise<boolean>;
  submitRadiations: () => Promise<boolean>;
  submitIntensities: () => Promise<boolean>;
  submitSensations: () => Promise<boolean>;
  submitTimingAndMovements: () => Promise<boolean>;
}

export const usePainSessionStore = create<PainSessionState>((set, get) => ({
  sessionId: null,
  sessionToken: null,
  painRecordId: null,
  currentStep: 'SCREEN_1_WELCOME',
  language: 'ar',
  activeView: 'front',
  locations: [],
  activeLocationId: null,
  timing: {
    onsetHours: [7, 8],
    isConstant: false,
    frequency: 'daily',
    peakHours: [7]
  },
  movements: [],
  isSubmitting: false,
  errorMessage: null,

  // Phase 4 Initial State
  audioMemo: {
    hasAudio: false,
    durationSeconds: 0
  },
  reportData: null,
  editingDimension: null,

  setLanguage: (language: LanguageCode) => {
    set({ language });
    document.documentElement.setAttribute('dir', language === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  },

  setStep: (currentStep: StepName) => set({ currentStep }),

  toggleView: () => set((state) => ({ activeView: state.activeView === 'front' ? 'back' : 'front' })),
  setView: (view: 'front' | 'back') => set({ activeView: view }),

  startSession: async (): Promise<boolean> => {
    const { language } = get();
    set({ isSubmitting: true, errorMessage: null });

    try {
      const response = await apiClient.createSession(language);

      if (response.success && response.data) {
        const { sessionId, sessionToken, painRecordId, currentStep } = response.data;
        set({
          sessionId,
          sessionToken,
          painRecordId,
          currentStep: currentStep || 'SCREEN_2_LOCATION',
          isSubmitting: false
        });
        return true;
      } else {
        const errorMsg =
          response.error?.message ||
          (language === 'ar' ? 'فشل إنشاء الجلسة، حاول ثانية' : 'Échec de création de la session');
        set({ errorMessage: errorMsg, isSubmitting: false });
        return false;
      }
    } catch {
      set({
        errorMessage: language === 'ar' ? 'حدث خطأ غير متوقع أثناء بدء الجلسة' : 'Une erreur inattendue est survenue',
        isSubmitting: false
      });
      return false;
    }
  },

  addLocation: (bodyPart: string, coordinates: { x: number; y: number }) => {
    const { activeView, locations } = get();
    const locationId = `loc_${bodyPart}_${Date.now().toString().slice(-4)}`;

    const newLoc: PainLocation = {
      locationId,
      bodyPart,
      bodyView: activeView,
      coordinates: { x: coordinates.x, y: coordinates.y, radius: 6 },
      intensity: { level: 5, colorHex: '#E63946' },
      radiation: { hasRadiation: false },
      sensations: []
    };

    set({
      locations: [...locations, newLoc],
      activeLocationId: locationId
    });
  },

  removeLocation: (locationId: string) => {
    const { locations, activeLocationId } = get();
    const updated = locations.filter((l) => l.locationId !== locationId);
    set({
      locations: updated,
      activeLocationId: activeLocationId === locationId ? (updated[0]?.locationId || null) : activeLocationId
    });
  },

  setActiveLocation: (activeLocationId: string | null) => set({ activeLocationId }),

  setRadiation: (locationId: string, hasRadiation: boolean, endCoords?: { x: number; y: number }, path?: string) => {
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.locationId === locationId
          ? {
              ...loc,
              radiation: {
                hasRadiation,
                endCoordinates: endCoords,
                pathVector: path
              }
            }
          : loc
      )
    }));
  },

  setIntensity: (locationId: string, level: number, colorHex: string) => {
    set((state) => ({
      locations: state.locations.map((loc) =>
        loc.locationId === locationId
          ? {
              ...loc,
              intensity: { level, colorHex }
            }
          : loc
      )
    }));
  },

  attachSensation: (locationId: string, sensationType: string, iconId: string) => {
    set((state) => ({
      locations: state.locations.map((loc) => {
        if (loc.locationId !== locationId) return loc;
        const sensations = loc.sensations || [];
        const exists = sensations.some((s) => s.type === sensationType);
        if (exists) {
          return {
            ...loc,
            sensations: sensations.filter((s) => s.type !== sensationType)
          };
        }
        return {
          ...loc,
          sensations: [
            ...sensations,
            { type: sensationType, iconId, placedCoordinates: loc.coordinates }
          ]
        };
      })
    }));
  },

  removeSensation: (locationId: string, sensationType: string) => {
    set((state) => ({
      locations: state.locations.map((loc) => {
        if (loc.locationId !== locationId) return loc;
        return {
          ...loc,
          sensations: (loc.sensations || []).filter((s) => s.type !== sensationType)
        };
      })
    }));
  },

  setTiming: (timingUpdates: Partial<TimingState>) => {
    set((state) => ({
      timing: { ...state.timing, ...timingUpdates }
    }));
  },

  toggleHour: (hour: number) => {
    set((state) => {
      const hours = state.timing.onsetHours;
      const exists = hours.includes(hour);
      const updated = exists ? hours.filter((h) => h !== hour) : [...hours, hour].sort((a, b) => a - b);
      return {
        timing: {
          ...state.timing,
          onsetHours: updated,
          peakHours: updated.length > 0 ? [updated[0]] : []
        }
      };
    });
  },

  setFrequency: (frequency: string) => {
    set((state) => ({
      timing: { ...state.timing, frequency }
    }));
  },

  toggleMovement: (movementId: string, severity: 'mild' | 'moderate' | 'severe' = 'severe') => {
    const { movements, locations, activeLocationId } = get();
    const targetLoc = activeLocationId || locations[0]?.locationId || 'loc_general';
    const exists = movements.find((m) => m.movementId === movementId);

    if (exists) {
      set({ movements: movements.filter((m) => m.movementId !== movementId) });
    } else {
      set({
        movements: [...movements, { movementId, affectedLocationId: targetLoc, severity }]
      });
    }
  },

  // --- Phase 4 F8 Quick In-Place Mutation ---
  quickEditDimension: (dimension: 'location' | 'radiation' | 'intensity' | 'nature' | 'timing' | 'movements') => {
    set({ editingDimension: dimension });
    switch (dimension) {
      case 'location':
        set({ currentStep: 'SCREEN_2_LOCATION' });
        break;
      case 'radiation':
        set({ currentStep: 'SCREEN_3_RADIATION' });
        break;
      case 'intensity':
        set({ currentStep: 'SCREEN_4_INTENSITY' });
        break;
      case 'nature':
        set({ currentStep: 'SCREEN_5_NATURE' });
        break;
      case 'timing':
      case 'movements':
        set({ currentStep: 'SCREEN_6_TIME_MOVEMENT' });
        break;
    }
  },

  returnToReport: () => {
    set({ editingDimension: null, currentStep: 'SCREEN_7_REPORT' });
  },

  mutateDimensionInPlace: async (targetDimension: string, payload: any): Promise<boolean> => {
    const { painRecordId, sessionToken } = get();
    if (!painRecordId) return false;

    set({ isSubmitting: true, errorMessage: null });
    const res = await apiClient.mutateDimension(painRecordId, targetDimension, payload, sessionToken);
    set({ isSubmitting: false });

    if (res.success) {
      return true;
    }
    set({ errorMessage: res.error?.message || 'فشل تعديل البعد' });
    return false;
  },

  recordAudioMemo: async (durationSeconds: number): Promise<boolean> => {
    const { painRecordId, sessionToken } = get();
    if (!painRecordId) return false;

    set({ isSubmitting: true, errorMessage: null });
    const res = await apiClient.uploadAudio(painRecordId, durationSeconds, sessionToken);
    set({ isSubmitting: false });

    if (res.success && res.data) {
      set({
        audioMemo: {
          hasAudio: true,
          durationSeconds: res.data.durationSeconds,
          audioVaultId: res.data.audioVaultId
        }
      });
      return true;
    }
    set({ errorMessage: res.error?.message || 'فشل حفظ التسجيل الصوتي' });
    return false;
  },

  deleteAudioMemo: async (): Promise<boolean> => {
    const { painRecordId, sessionToken } = get();
    if (!painRecordId) return false;

    set({ isSubmitting: true, errorMessage: null });
    const res = await apiClient.deleteAudio(painRecordId, sessionToken);
    set({ isSubmitting: false });

    if (res.success) {
      set({
        audioMemo: {
          hasAudio: false,
          durationSeconds: 0,
          audioVaultId: undefined
        }
      });
      return true;
    }
    return false;
  },

  generateClinicalReport: async (): Promise<boolean> => {
    const { painRecordId, audioMemo, sessionToken } = get();
    if (!painRecordId) return false;

    set({ isSubmitting: true, errorMessage: null });
    const res = await apiClient.generateReport(
      painRecordId,
      { includeAudio: Boolean(audioMemo.hasAudio) },
      sessionToken
    );
    set({ isSubmitting: false });

    if (res.success && res.data) {
      set({
        reportData: res.data,
        currentStep: 'SCREEN_7_REPORT'
      });
      return true;
    }
    set({ errorMessage: res.error?.message || 'فشل توليد التقرير السريري' });
    return false;
  },

  submitLocations: async (): Promise<boolean> => {
    const { painRecordId, locations, sessionToken, editingDimension } = get();
    if (!painRecordId || locations.length === 0) return false;

    set({ isSubmitting: true, errorMessage: null });
    const res = await apiClient.updateLocations(painRecordId, locations, sessionToken);
    set({ isSubmitting: false });

    if (res.success) {
      if (editingDimension) {
        set({ editingDimension: null, currentStep: 'SCREEN_7_REPORT' });
      } else {
        set({ currentStep: 'SCREEN_3_RADIATION' });
      }
      return true;
    }
    set({ errorMessage: res.error?.message || 'فشل حفظ مواضع الألم' });
    return false;
  },

  submitRadiations: async (): Promise<boolean> => {
    const { painRecordId, locations, sessionToken, editingDimension } = get();
    if (!painRecordId) return false;

    const radiations = locations.map((l) => ({
      locationId: l.locationId,
      hasRadiation: l.radiation?.hasRadiation || false,
      endCoordinates: l.radiation?.endCoordinates || l.coordinates,
      pathVector: l.radiation?.pathVector || ''
    }));

    set({ isSubmitting: true, errorMessage: null });
    const res = await apiClient.updateRadiations(painRecordId, radiations, sessionToken);
    set({ isSubmitting: false });

    if (res.success) {
      if (editingDimension) {
        set({ editingDimension: null, currentStep: 'SCREEN_7_REPORT' });
      } else {
        set({ currentStep: 'SCREEN_4_INTENSITY' });
      }
      return true;
    }
    set({ errorMessage: res.error?.message || 'فشل حفظ مسار انتشار الألم' });
    return false;
  },

  submitIntensities: async (): Promise<boolean> => {
    const { painRecordId, locations, sessionToken, editingDimension } = get();
    if (!painRecordId) return false;

    const intensities = locations.map((l) => ({
      locationId: l.locationId,
      level: l.intensity?.level || 5,
      colorHex: l.intensity?.colorHex || '#E63946',
      gradientSpread: 12,
      isSharpCenter: (l.intensity?.level || 5) > 7
    }));

    set({ isSubmitting: true, errorMessage: null });
    const res = await apiClient.updateIntensities(painRecordId, intensities, sessionToken);
    set({ isSubmitting: false });

    if (res.success) {
      if (editingDimension) {
        set({ editingDimension: null, currentStep: 'SCREEN_7_REPORT' });
      } else {
        set({ currentStep: 'SCREEN_5_NATURE' });
      }
      return true;
    }
    set({ errorMessage: res.error?.message || 'فشل حفظ درجات الشدة' });
    return false;
  },

  submitSensations: async (): Promise<boolean> => {
    const { painRecordId, locations, sessionToken, editingDimension } = get();
    if (!painRecordId) return false;

    const sensations: any[] = [];
    locations.forEach((loc) => {
      (loc.sensations || []).forEach((s) => {
        sensations.push({
          locationId: loc.locationId,
          type: s.type,
          iconId: s.iconId || `icon_${s.type}`,
          placedCoordinates: loc.coordinates
        });
      });
    });

    set({ isSubmitting: true, errorMessage: null });
    const res = await apiClient.updateSensations(painRecordId, sensations, sessionToken);
    set({ isSubmitting: false });

    if (res.success) {
      if (editingDimension) {
        set({ editingDimension: null, currentStep: 'SCREEN_7_REPORT' });
      } else {
        set({ currentStep: 'SCREEN_6_TIME_MOVEMENT' });
      }
      return true;
    }
    set({ errorMessage: res.error?.message || 'فشل حفظ طبيعة الألم' });
    return false;
  },

  submitTimingAndMovements: async (): Promise<boolean> => {
    const { painRecordId, timing, movements, sessionToken, editingDimension } = get();
    if (!painRecordId) return false;

    set({ isSubmitting: true, errorMessage: null });
    const resTiming = await apiClient.updateTiming(painRecordId, timing, sessionToken);
    const resMovements = await apiClient.updateMovements(painRecordId, movements, sessionToken);
    set({ isSubmitting: false });

    if (resTiming.success && resMovements.success) {
      if (editingDimension) {
        set({ editingDimension: null, currentStep: 'SCREEN_7_REPORT' });
      } else {
        // Automatically generate report upon reaching Screen 7
        const resReport = await apiClient.generateReport(painRecordId, {}, sessionToken);
        if (resReport.success) {
          set({ reportData: resReport.data });
        }
        set({ currentStep: 'SCREEN_7_REPORT' });
      }
      return true;
    }
    set({ errorMessage: 'فشل حفظ التوقيت أو الحركات' });
    return false;
  },

  resetSession: () =>
    set({
      sessionId: null,
      sessionToken: null,
      painRecordId: null,
      currentStep: 'SCREEN_1_WELCOME',
      locations: [],
      activeLocationId: null,
      timing: { onsetHours: [7, 8], isConstant: false, frequency: 'daily', peakHours: [7] },
      movements: [],
      audioMemo: { hasAudio: false, durationSeconds: 0 },
      reportData: null,
      editingDimension: null,
      isSubmitting: false,
      errorMessage: null
    }),

  clearError: () => set({ errorMessage: null })
}));
