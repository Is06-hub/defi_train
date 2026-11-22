// frontend/src/screens/Screen4_Intensity.tsx
import React, { useState } from 'react';
import { usePainSessionStore } from '../store/usePainSessionStore';
import avatarIntensity from '../assets/avatar_intensity.png';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ColorSwatch {
  level: number;
  hex: string;
  label: string;
}

const SWATCHES: ColorSwatch[] = [
  { level: 2, hex: '#F8D5C2', label: 'خفيف' },
  { level: 4, hex: '#F6A882', label: 'متوسط خفيف' },
  { level: 6, hex: '#F17A4A', label: 'متوسط' },
  { level: 8, hex: '#E84C4C', label: 'شديد' },
  { level: 10, hex: '#DE3C36', label: 'أقصى' },
];

export const Screen4_Intensity: React.FC = () => {
  const {
    locations,
    activeLocationId,
    setIntensity,
    submitIntensities,
    isSubmitting,
    setStep,
    errorMessage,
    editingDimension,
    returnToReport
  } = usePainSessionStore();

  const targetLocation = locations.find((l) => l.locationId === activeLocationId) || locations[0];

  // Default to level 8 (Swatch index 3, matching mockup media_1795340795301_3886351c.jpg)
  const [selectedLevel, setSelectedLevel] = useState<number>(
    targetLocation?.intensity?.level || 8
  );

  const activeSwatch = SWATCHES.find((s) => s.level === selectedLevel) || SWATCHES[3];

  const handleSelectSwatch = (swatch: ColorSwatch) => {
    setSelectedLevel(swatch.level);
    if (targetLocation) {
      setIntensity(targetLocation.locationId, swatch.level, swatch.hex);
    }
  };

  const handleNext = () => {
    if (targetLocation) {
      setIntensity(targetLocation.locationId, activeSwatch.level, activeSwatch.hex);
    }
    submitIntensities();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F263A] flex flex-col justify-between items-center px-6 py-6 sm:py-8 max-w-md mx-auto select-none font-sans" dir="rtl">
      {/* Top Header */}
      <header className="w-full text-center pt-1 sm:pt-3">
        {/* Step Indicator Text */}
        <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-3 tracking-tight">
          الخطوة ٣ من ٦
        </h2>

        {/* 6-Step Horizontal Progress Stepper (Matches Image 4) */}
        <div className="w-full max-w-[320px] mx-auto relative flex items-center justify-between px-2 mb-4">
          {/* Connector Bar */}
          <div className="h-[2px] bg-[#E2DBD3] absolute left-3 right-3 top-1/2 -translate-y-1/2 z-0" />

          {/* Step 1: Completed */}
          <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#277885]" />

          {/* Step 2: Completed */}
          <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#277885]" />

          {/* Step 3: Active (Concentric ring matching mockup) */}
          <div className="relative z-10 w-6 h-6 rounded-full border-2 border-[#277885] bg-[#FAF7F2] flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-[#277885]" />
          </div>

          {/* Step 4: Inactive */}
          <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#D8D2CA]" />

          {/* Step 5: Inactive */}
          <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#D8D2CA]" />

          {/* Step 6: Inactive */}
          <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#D8D2CA]" />
        </div>

        {/* Main Title Question */}
        <h1 className="text-[#0F263A] text-2xl sm:text-[30px] font-black leading-tight mb-1.5 tracking-tight">
          ما شدة الألم؟
        </h1>

        {/* Action Instruction */}
        <p className="text-[#697A8B] text-sm sm:text-base font-medium">
          اختر اللون الأقرب إلى إحساسك
        </p>
      </header>

      {/* Center Interactive Avatar with Dynamic Pain Halo */}
      <main className="flex-1 w-full flex flex-col items-center justify-center my-auto py-2 relative">
        <div className="relative w-full max-w-[210px] sm:max-w-[235px] flex items-center justify-center select-none">
          <img
            src={avatarIntensity}
            alt="مجسم شدة الألم"
            className="w-full h-auto object-contain drop-shadow-xs pointer-events-none"
            draggable={false}
          />

          {/* Dynamic Thermal Glow on Chest reflecting selected intensity */}
          <div
            className="absolute pointer-events-none transition-all duration-300"
            style={{
              left: '64%',
              top: '28%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div
              className="rounded-full blur-md opacity-75 transition-all duration-300"
              style={{
                width: `${24 + selectedLevel * 3}px`,
                height: `${24 + selectedLevel * 3}px`,
                backgroundColor: activeSwatch.hex,
                boxShadow: `0 0 ${16 + selectedLevel * 2}px ${activeSwatch.hex}`,
              }}
            />
          </div>
        </div>
      </main>

      {/* Floating Intensity Selector Card & Actions */}
      <div className="w-full space-y-3 pb-2">
        {/* White Floating Selector Card (Matches Image 4) */}
        <div className="w-full bg-white rounded-[26px] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-[#EDE8E0]">
          {/* Top Range Labels */}
          <div className="flex items-center justify-between text-sm font-bold mb-3 px-1">
            <span className="text-[#8D9AA6]">خفيف</span>
            <div className="flex-1 mx-3 h-[1px] bg-[#E8E2D9]" />
            <span className="text-[#D3524B]">شديد</span>
          </div>

          {/* 5 Circular Color Swatches */}
          <div className="flex items-center justify-between px-1 pt-1">
            {SWATCHES.map((swatch) => {
              const isSelected = swatch.level === selectedLevel;
              return (
                <button
                  key={swatch.level}
                  type="button"
                  onClick={() => handleSelectSwatch(swatch)}
                  className={`transition-all duration-150 cursor-pointer flex items-center justify-center rounded-full ${
                    isSelected
                      ? 'w-11 h-11 p-[3px] border-2 border-[#277885] bg-white shadow-sm scale-110'
                      : 'w-10 h-10 hover:scale-105 active:scale-95'
                  }`}
                  aria-label={`درجة الشدة ${swatch.level}`}
                >
                  <div
                    className="w-full h-full rounded-full transition-transform"
                    style={{ backgroundColor: swatch.hex }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Error Message if any */}
        {errorMessage && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* Bottom Action Buttons (Side-by-side row matching Image 4) */}
        <footer className="w-full flex items-center gap-3 pt-1">
          {/* Right Button (RTL Primary): متابعة */}
          <button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting}
            className="flex-1 h-[56px] sm:h-[60px] rounded-full bg-[#277885] hover:bg-[#1F6773] active:scale-[0.98] text-white font-extrabold text-lg sm:text-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                <span>جارِ الحفظ...</span>
              </span>
            ) : (
              <>
                <span>متابعة</span>
                <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>

          {/* Left Button (Secondary): رجوع */}
          <button
            type="button"
            onClick={() => (editingDimension ? returnToReport() : setStep('SCREEN_3_RADIATION'))}
            className="flex-1 h-[56px] sm:h-[60px] rounded-full bg-[#F4EAE1] hover:bg-[#EAE0D7] active:scale-[0.98] text-[#0F263A] font-extrabold text-lg sm:text-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer border-0"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
            <span>رجوع</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Screen4_Intensity;
