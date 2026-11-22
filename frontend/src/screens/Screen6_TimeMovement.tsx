// frontend/src/screens/Screen6_TimeMovement.tsx
import React, { useState } from 'react';
import { usePainSessionStore } from '../store/usePainSessionStore';
import miniAvatar from '../assets/mini_avatar.png';
import movementBending from '../assets/movement_bending.png';
import movementArm from '../assets/movement_arm.png';
import movementWalking from '../assets/movement_walking.png';
import movementStanding from '../assets/movement_standing.png';
import { Clock, Calendar, Check, ArrowRight, ArrowLeft, ChevronLeft, ChevronRight, Flower2 } from 'lucide-react';

interface MovementDef {
  id: string;
  name: string;
  image: string;
}

const MOVEMENTS: MovementDef[] = [
  { id: 'bending', name: 'الانحناء', image: movementBending },
  { id: 'raising_arm', name: 'رفع الذراع', image: movementArm },
  { id: 'walking', name: 'المشي', image: movementWalking },
  { id: 'standing', name: 'الوقوف', image: movementStanding },
];

export const Screen6_TimeMovement: React.FC = () => {
  const {
    timing,
    setTiming,
    movements,
    toggleMovement,
    submitTimingAndMovements,
    isSubmitting,
    setStep,
    errorMessage,
    editingDimension,
    returnToReport
  } = usePainSessionStore();

  // Sub-step: 'time' (Step 5 of 6) or 'movement' (Step 6 of 6)
  const [subStep, setSubStep] = useState<'time' | 'movement'>('time');

  // Time state matching mockup media_1795342018804_3f0d9f51.jpg
  const [activeTimingMode, setActiveTimingMode] = useState<'onset' | 'recurring'>('onset');
  const [frequency, setFrequency] = useState<'once' | 'multiple'>(
    timing.frequency === 'constant' || timing.frequency === 'multiple_daily' ? 'multiple' : 'multiple'
  );
  const [selectedHours, setSelectedHours] = useState<number[]>([6, 18]);

  // Movement selection: default to 'raising_arm' matching mockup media_1795342029192_38ac2cc8.jpg
  const [selectedMovementId, setSelectedMovementId] = useState<string>('raising_arm');

  const handleTimeNext = () => {
    setTiming({
      frequency: frequency === 'multiple' ? 'multiple_daily' : 'rarely',
      onsetHours: selectedHours,
    });
    setSubStep('movement');
  };

  const handleMovementSelect = (id: string) => {
    setSelectedMovementId(id);
    toggleMovement(id, 'moderate');
  };

  const handleFinalSubmit = () => {
    submitTimingAndMovements();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F263A] flex flex-col justify-between items-center px-5 py-5 sm:py-7 max-w-md mx-auto select-none font-sans" dir="rtl">
      {/* ========================================================================= */}
      {/* SUB-STEP 1: TIME (الخطوة ٥ من ٦ / متى يظهر الألم؟)                       */}
      {/* ========================================================================= */}
      {subStep === 'time' && (
        <div className="w-full flex-1 flex flex-col justify-between">
          {/* Header */}
          <header className="w-full relative pt-1 text-center">
            {/* Top Floral Badge on Right */}
            <div className="absolute right-0 top-0 flex items-center gap-1 text-[#277885]">
              <div className="w-9 h-9 rounded-full bg-[#E5F2F0] flex items-center justify-center">
                <Flower2 className="w-5 h-5 text-[#277885]" />
              </div>
            </div>

            <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-1.5 tracking-tight">
              الخطوة ٥ من ٦
            </h2>
            <h1 className="text-[#0F263A] text-2xl sm:text-[30px] font-black leading-tight mb-1.5 tracking-tight">
              متى يظهر الألم؟
            </h1>
            <p className="text-[#697A8B] text-sm sm:text-base font-medium">
              اسحب العلامات لتحديد الوقت
            </p>
          </header>

          {/* Center Timeline Card (Matches Image 6) */}
          <main className="my-auto py-3">
            <div className="w-full bg-white rounded-[32px] p-5 sm:p-6 shadow-[0_4px_24px_rgba(0,0,0,0.05)] border border-[#ECE5DC] space-y-5">
              {/* Top Mode Segmented Pill */}
              <div className="flex items-center justify-end">
                <div className="bg-[#EFECE7] p-1 rounded-full flex items-center gap-1 shadow-inner">
                  <button
                    type="button"
                    onClick={() => setActiveTimingMode('onset')}
                    className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTimingMode === 'onset'
                        ? 'bg-[#E26153] text-white shadow-xs'
                        : 'text-[#697A8B] hover:text-[#0F263A]'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>بداية الألم</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveTimingMode('recurring')}
                    className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                      activeTimingMode === 'recurring'
                        ? 'bg-[#E26153] text-white shadow-xs'
                        : 'text-[#697A8B] hover:text-[#0F263A]'
                    }`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>يتكرر</span>
                  </button>
                </div>
              </div>

              {/* 24h Timeline Display */}
              <div className="pt-6 pb-2">
                {/* Floating Pins Row */}
                <div className="relative h-10 w-full mb-1">
                  {/* Pin 1: بداية الألم at 06:00 */}
                  <div className="absolute right-[18%] -top-2 -translate-x-1/2 flex flex-col items-center">
                    <span className="bg-[#E26153] text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1 mb-1">
                      <Calendar className="w-2.5 h-2.5" />
                      بداية الألم
                    </span>
                    <div className="w-4 h-4 rounded-full bg-[#E26153] border-2 border-white shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>

                  {/* Pin 2: يتكرر at 18:00 */}
                  <div className="absolute right-[70%] -top-2 -translate-x-1/2 flex flex-col items-center">
                    <span className="bg-[#FAF0ED] text-[#E26153] border border-[#F3C4BC] text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs flex items-center gap-1 mb-1">
                      <Clock className="w-2.5 h-2.5" />
                      يتكرر
                    </span>
                    <div className="w-4 h-4 rounded-full bg-[#E26153] border-2 border-white shadow-sm flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    </div>
                  </div>
                </div>

                {/* Timeline Bar Track */}
                <div className="relative w-full h-3 bg-[#E5EEEB] rounded-full flex items-center px-1">
                  <div className="absolute inset-x-2 h-1 bg-[#277885] rounded-full" />
                  {/* Hourly tick marks */}
                  {[0, 6, 12, 18, 24].map((hr, idx) => (
                    <div
                      key={hr}
                      className="absolute w-2 h-2 rounded-full bg-[#277885] -translate-x-1/2"
                      style={{ right: `${(idx / 4) * 94 + 3}%` }}
                    />
                  ))}
                </div>

                {/* Hour Labels Above/Below Track */}
                <div className="flex justify-between text-xs font-black text-[#0F263A] pt-2 px-1">
                  <span>٠٦</span>
                  <span>12</span>
                  <span>١٨</span>
                  <span>24</span>
                </div>

                {/* Day Period Descriptive Labels */}
                <div className="flex justify-between text-xs font-bold text-[#8D9AA6] pt-1 px-1">
                  <span>صباحاً</span>
                  <span>ظهراً</span>
                  <span>مساءً</span>
                  <span>ليلاً</span>
                </div>
              </div>

              {/* Frequency Segmented Pills */}
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setFrequency('multiple')}
                  className={`flex-1 py-3 px-4 rounded-2xl text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    frequency === 'multiple'
                      ? 'bg-[#EF6B5A] text-white shadow-sm'
                      : 'bg-[#F2ECE4] text-[#0F263A] hover:bg-[#EAE2D8]'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  <span>عدة مرات</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFrequency('once')}
                  className={`flex-1 py-3 px-4 rounded-2xl text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    frequency === 'once'
                      ? 'bg-[#EF6B5A] text-white shadow-sm'
                      : 'bg-[#E5EEF1] text-[#0F263A] hover:bg-[#DAE7EB]'
                  }`}
                >
                  <span>مرة واحدة</span>
                </button>
              </div>

              {/* Mini Avatar Badge at Bottom-Left */}
              <div className="flex items-center justify-start pt-2">
                <div className="relative flex items-center gap-2 p-1.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D9]">
                  <img src={miniAvatar} alt="مكان الألم" className="w-14 h-14 object-contain" />
                  <span className="bg-[#EF6B5A] text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-2xs">
                    مكان الألم
                  </span>
                </div>
              </div>
            </div>
          </main>

          {/* Bottom Action Buttons (Step 5) */}
          <footer className="w-full space-y-2.5 pt-2 pb-1">
            <button
              type="button"
              onClick={handleTimeNext}
              className="w-full h-[56px] sm:h-[60px] rounded-full bg-[#277885] hover:bg-[#1F6773] active:scale-[0.98] text-white font-extrabold text-xl shadow-sm transition-all flex items-center justify-center cursor-pointer"
            >
              متابعة
            </button>

            <button
              type="button"
              onClick={() => (editingDimension ? returnToReport() : setStep('SCREEN_5_NATURE'))}
              className="w-full h-[56px] sm:h-[60px] rounded-full bg-[#D5E4DF] hover:bg-[#CADFD8] active:scale-[0.98] text-[#277885] font-extrabold text-xl transition-all flex items-center justify-center cursor-pointer border-0"
            >
              رجوع
            </button>
          </footer>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-STEP 2: MOVEMENTS (الخطوة ٦ من ٦ / ما الحركات التي تصعب عليك؟)          */}
      {/* ========================================================================= */}
      {subStep === 'movement' && (
        <div className="w-full flex-1 flex flex-col justify-between">
          {/* Header */}
          <header className="w-full relative pt-1 text-center">
            {/* Top Row: Back button on Left, Clinic Logo on Right */}
            <div className="w-full flex items-center justify-between mb-2">
              <button
                type="button"
                onClick={() => setSubStep('time')}
                className="w-9 h-9 rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-[#0F263A] hover:bg-black/5 cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5 text-right">
                <span className="text-xs font-black text-[#0F263A] leading-none">
                  عيادة
                  <br />
                  الصحة
                </span>
                <div className="w-8 h-8 rounded-full bg-[#E5F2F0] flex items-center justify-center">
                  <Flower2 className="w-4 h-4 text-[#277885]" />
                </div>
              </div>
            </div>

            <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-1 tracking-tight">
              الخطوة ٦ من ٦
            </h2>
            <h1 className="text-[#0F263A] text-2xl sm:text-[28px] font-black leading-tight mb-1 tracking-tight">
              ما الحركات التي تصعب عليك؟
            </h1>
            <p className="text-[#697A8B] text-sm sm:text-base font-medium">
              اختر الحركة المتأثرة
            </p>
          </header>

          {/* List of 4 Movement Cards (Matches Image 7) */}
          <main className="my-auto py-2 space-y-2.5 w-full">
            {MOVEMENTS.map((m) => {
              const isSelected = m.id === selectedMovementId;
              return (
                <div
                  key={m.id}
                  onClick={() => handleMovementSelect(m.id)}
                  className={`w-full p-3 sm:p-3.5 rounded-2xl flex items-center justify-between transition-all duration-150 cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-[#E9F5F3] border-2 border-[#277885] shadow-sm'
                      : 'bg-white border border-[#ECE5DC] hover:border-[#277885]/40 hover:bg-[#FAFAF8]'
                  }`}
                >
                  {/* Movement Figure on Right (in RTL) */}
                  <div className="w-20 h-16 sm:w-24 sm:h-18 flex items-center justify-center">
                    <img
                      src={m.image}
                      alt={m.name}
                      className="max-h-full max-w-full object-contain pointer-events-none"
                    />
                  </div>

                  {/* Title in Center */}
                  <div className="flex-1 text-center px-3">
                    <span className="text-lg sm:text-xl font-black text-[#0F263A]">
                      {m.name}
                    </span>
                  </div>

                  {/* Radio Button on Left (in RTL) */}
                  <div className="w-8 flex items-center justify-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-[#277885] bg-[#277885] text-white shadow-2xs'
                          : 'border-[#B8C5CA] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>
                </div>
              );
            })}
          </main>

          {/* Error Message if any */}
          {errorMessage && (
            <div className="w-full p-2 mb-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold text-center">
              {errorMessage}
            </div>
          )}

          {/* Bottom Action Buttons (Step 6) */}
          <footer className="w-full space-y-2 pt-2 pb-1 text-center">
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="w-full h-[56px] sm:h-[60px] rounded-full bg-[#277885] hover:bg-[#1F6773] active:scale-[0.98] text-white font-extrabold text-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {isSubmitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                  <span>جارِ إصدار التقرير...</span>
                </span>
              ) : (
                <>
                  <span>عرض التقرير</span>
                  <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setSubStep('time')}
              className="inline-flex items-center gap-1 text-sm font-bold text-[#697A8B] hover:text-[#0F263A] pt-1 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
              <span>رجوع</span>
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default Screen6_TimeMovement;
