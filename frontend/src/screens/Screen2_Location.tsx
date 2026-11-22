// frontend/src/screens/Screen2_Location.tsx
import React, { useState, useEffect } from 'react';
import { usePainSessionStore } from '../store/usePainSessionStore';
import avatarClean from '../assets/avatar_clean.png';
import { User, PlusCircle } from 'lucide-react';

export const Screen2_Location: React.FC = () => {
  const {
    activeView,
    setView,
    locations,
    addLocation,
    submitLocations,
    isSubmitting,
    errorMessage,
    setStep,
    editingDimension,
    returnToReport
  } = usePainSessionStore();

  // Shoulder coordinates from image 2
  const DEFAULT_SHOULDER_COORDS = { x: 59, y: 32 };

  // Initialize with shoulder location if none exists
  useEffect(() => {
    if (locations.length === 0) {
      addLocation('shoulder', DEFAULT_SHOULDER_COORDS);
    }
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
    const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);

    // Determine body part roughly from Y coordinate
    let part = 'body';
    if (clickY < 18) part = 'head';
    else if (clickY < 26) part = 'neck';
    else if (clickY < 38) part = 'shoulder';
    else if (clickY < 50) part = 'chest';
    else if (clickY < 65) part = 'lower_back';
    else if (clickY < 75) part = 'hip';
    else if (clickY < 90) part = 'knee';
    else part = 'foot';

    addLocation(part, { x: clickX, y: clickY });
  };

  const handleAddLocationClick = () => {
    // Add an additional location default or prompt
    addLocation('chest', { x: 50, y: 44 });
  };

  const currentViewLocations = locations.filter((l) => l.bodyView === activeView);
  const activePoint = currentViewLocations.length > 0 
    ? currentViewLocations[currentViewLocations.length - 1].coordinates 
    : DEFAULT_SHOULDER_COORDS;

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F263A] flex flex-col justify-between items-center px-6 py-8 sm:py-10 max-w-md mx-auto select-none font-sans" dir="rtl">
      {/* Top Header */}
      <header className="w-full text-center pt-2 sm:pt-4">
        {/* Step Indicator */}
        <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-1.5 tracking-tight">
          الخطوة ١ من ٦
        </h2>

        {/* Main Title Question */}
        <h1 className="text-[#0F263A] text-2xl sm:text-[30px] font-black leading-tight mb-2 tracking-tight">
          أين تشعر بالألم؟
        </h1>

        {/* Action Instruction */}
        <p className="text-[#697A8B] text-sm sm:text-base font-medium">
          المس المكان على الجسم
        </p>
      </header>

      {/* Center Interactive Body Canvas */}
      <main className="flex-1 w-full flex flex-col items-center justify-center my-auto py-2 relative">
        {/* Clickable Avatar Container */}
        <div
          onClick={handleCanvasClick}
          className="relative w-full max-w-[270px] sm:max-w-[295px] flex items-center justify-center cursor-pointer select-none"
        >
          <img
            src={avatarClean}
            alt="نموذج الجسم لتحديد موضع الألم"
            className="w-full h-auto object-contain drop-shadow-xs pointer-events-none"
            draggable={false}
          />

          {/* Glowing Red-Orange Pain Dot (matches image 2) */}
          <div
            style={{ left: `${activePoint.x}%`, top: `${activePoint.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-200"
          >
            {/* Outer Soft Glow Halo */}
            <div className="w-12 h-12 rounded-full bg-[#E64A19]/35 blur-[2px] animate-pulse absolute -translate-x-1/2 -translate-y-1/2" />
            
            {/* Concentric Thin Orange Ring */}
            <div className="w-8 h-8 rounded-full border border-[#E64A19]/60 absolute -translate-x-1/2 -translate-y-1/2" />
            
            {/* Solid Red-Orange Dot with Solid White Center Dot */}
            <div className="w-5 h-5 rounded-full bg-[#E64A19] border border-[#FF7043] flex items-center justify-center shadow-md absolute -translate-x-1/2 -translate-y-1/2">
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
            </div>
          </div>
        </div>

        {/* Mid Controls Row (Just above the bottom buttons) */}
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

          {/* Right: + إضافة موضع Button */}
          <button
            type="button"
            onClick={handleAddLocationClick}
            className="min-h-[40px] px-4 py-1.5 rounded-full border-2 border-[#277885] bg-transparent hover:bg-[#277885]/5 active:scale-95 text-[#277885] text-xs sm:text-sm font-black flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>إضافة موضع</span>
          </button>
        </div>
      </main>

      {/* Bottom Action Buttons */}
      <footer className="w-full pt-3 pb-2 space-y-3">
        {errorMessage && (
          <div className="p-2 mb-1 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold text-center">
            {errorMessage}
          </div>
        )}

        {/* Primary Action Button: متابعة */}
        <button
          type="button"
          onClick={submitLocations}
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

        {/* Secondary Action Button: رجوع */}
        <button
          type="button"
          onClick={() => (editingDimension ? returnToReport() : setStep('SCREEN_1_WELCOME'))}
          className="w-full h-[58px] sm:h-[62px] rounded-full border-2 border-[#D8D2CA] bg-transparent hover:bg-black/5 active:scale-[0.98] text-[#277885] font-extrabold text-xl transition-all duration-150 flex items-center justify-center cursor-pointer"
        >
          رجوع
        </button>
      </footer>
    </div>
  );
};

export default Screen2_Location;
