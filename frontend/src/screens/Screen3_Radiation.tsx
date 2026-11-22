// frontend/src/screens/Screen3_Radiation.tsx
import React, { useState } from 'react';
import { usePainSessionStore } from '../store/usePainSessionStore';
import avatarRadiation from '../assets/avatar_radiation.png';
import { User } from 'lucide-react';

export const Screen3_Radiation: React.FC = () => {
  const {
    locations,
    activeLocationId,
    setRadiation,
    submitRadiations,
    isSubmitting,
    setStep,
    errorMessage,
    editingDimension,
    returnToReport,
    activeView,
    setView
  } = usePainSessionStore();

  const targetLocation = locations.find((l) => l.locationId === activeLocationId) || locations[0];

  const [hasRadiationLocal, setHasRadiationLocal] = useState<boolean>(true);
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number }>(
    targetLocation?.radiation?.endCoordinates || { x: 45, y: 64 }
  );

  const handleNext = () => {
    if (targetLocation) {
      setRadiation(
        targetLocation.locationId,
        hasRadiationLocal,
        dragEnd,
        `M 47 44 Q 42 54 ${dragEnd.x} ${dragEnd.y}`
      );
    }
    submitRadiations();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F263A] flex flex-col justify-between items-center px-6 py-8 sm:py-10 max-w-md mx-auto select-none font-sans" dir="rtl">
      {/* Top Header */}
      <header className="w-full text-center pt-2 sm:pt-4">
        {/* Step Indicator */}
        <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-1.5 tracking-tight">
          الخطوة ٢ من ٦
        </h2>

        {/* Main Title Question */}
        <h1 className="text-[#0F263A] text-2xl sm:text-[30px] font-black leading-tight mb-2 tracking-tight">
          إلى أين يمتد الألم؟
        </h1>

        {/* Action Instruction */}
        <p className="text-[#697A8B] text-sm sm:text-base font-medium">
          اسحب من مكان البداية إلى مكان الإمتداد
        </p>
      </header>

      {/* Center Interactive Avatar & Radiation Vector (Matches Image 3) */}
      <main className="flex-1 w-full flex flex-col items-center justify-center my-auto py-2 relative">
        <div className="relative w-full max-w-[270px] sm:max-w-[295px] flex items-center justify-center select-none">
          <img
            src={avatarRadiation}
            alt="مسار امتداد الألم"
            className="w-full h-auto object-contain drop-shadow-xs pointer-events-none"
            draggable={false}
          />
        </div>

        {/* Mid Controls Row (Only view switcher on left, matching image 3) */}
        <div className="w-full flex items-center justify-between px-1 mt-3">
          {/* Left: View Toggle Switch (أمام 👤 | خلف) */}
          <div className="bg-[#EFECE7] p-1 rounded-full flex items-center shadow-inner">
            <button
              type="button"
              onClick={() => setView('front')}
              className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                activeView === 'front'
                  ? 'bg-white text-[#0F263A] shadow-xs'
                  : 'text-[#7A8A99] hover:text-[#0F263A]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>أمام</span>
            </button>

            <button
              type="button"
              onClick={() => setView('back')}
              className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${
                activeView === 'back'
                  ? 'bg-white text-[#0F263A] shadow-xs'
                  : 'text-[#7A8A99] hover:text-[#0F263A]'
              }`}
            >
              <span>خلف</span>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Action Buttons (Matching image 3) */}
      <footer className="w-full pt-3 pb-2 space-y-3">
        {errorMessage && (
          <div className="p-2 mb-1 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* Primary Action Button: متابعة */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="w-full h-[58px] sm:h-[62px] rounded-full bg-[#277885] hover:bg-[#1F6773] active:scale-[0.98] text-white font-extrabold text-xl shadow-sm transition-all duration-150 flex items-center justify-center cursor-pointer disabled:opacity-60"
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
            'متابعة'
          )}
        </button>

        {/* Secondary Action Button: رجوع (Soft light cyan/tinted button matching image 3) */}
        <button
          type="button"
          onClick={() => (editingDimension ? returnToReport() : setStep('SCREEN_2_LOCATION'))}
          className="w-full h-[58px] sm:h-[62px] rounded-full bg-[#D5E4DF] hover:bg-[#C9DCD7] active:scale-[0.98] text-[#277885] font-extrabold text-xl transition-all duration-150 flex items-center justify-center cursor-pointer border-0"
        >
          رجوع
        </button>
      </footer>
    </div>
  );
};

export default Screen3_Radiation;
