// frontend/src/screens/Screen5_Nature.tsx
import React, { useState } from 'react';
import { usePainSessionStore } from '../store/usePainSessionStore';
import avatarScrubs from '../assets/avatar_scrubs.png';
import { Flame, Zap, Activity, Wind, Move, ArrowRight, ArrowLeft, Hand } from 'lucide-react';

interface SensationItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  iconColor: string;
}

const SENSATIONS: SensationItem[] = [
  {
    id: 'pricking',
    name: 'وخز',
    icon: <Zap className="w-8 h-8 text-[#277885] stroke-[2.2]" />,
    iconColor: '#277885',
  },
  {
    id: 'throbbing',
    name: 'نبض',
    icon: <Activity className="w-8 h-8 text-[#D94F3D] stroke-[2.4]" />,
    iconColor: '#D94F3D',
  },
  {
    id: 'burning',
    name: 'حرقان',
    icon: <Flame className="w-8 h-8 text-[#277885] stroke-[2.2]" />,
    iconColor: '#277885',
  },
  {
    id: 'pressure',
    name: 'ضغط',
    icon: <Wind className="w-8 h-8 text-[#277885] stroke-[2.2]" />,
    iconColor: '#277885',
  },
];

export const Screen5_Nature: React.FC = () => {
  const {
    locations,
    activeLocationId,
    attachSensation,
    submitSensations,
    isSubmitting,
    setStep,
    errorMessage,
    editingDimension,
    returnToReport
  } = usePainSessionStore();

  const targetLocation = locations.find((l) => l.locationId === activeLocationId) || locations[0];

  // Default to 'burning' (حرقان) matching the mockup media_1795342006563_358159ae.jpg
  const initialSensation = targetLocation?.sensations?.[0]?.type || 'burning';
  const [selectedSensation, setSelectedSensation] = useState<string>(initialSensation);

  const activeItem = SENSATIONS.find((s) => s.id === selectedSensation) || SENSATIONS[2];

  const handleSelect = (id: string) => {
    setSelectedSensation(id);
    if (targetLocation) {
      attachSensation(targetLocation.locationId, id, `icon_${id}`);
    }
  };

  const handleNext = () => {
    if (targetLocation) {
      attachSensation(targetLocation.locationId, selectedSensation, `icon_${selectedSensation}`);
    }
    submitSensations();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F263A] flex flex-col justify-between items-center px-5 py-5 sm:py-7 max-w-md mx-auto select-none font-sans" dir="rtl">
      {/* Top Continuous Progress Bar */}
      <div className="w-full bg-[#E5EEEB] h-1.5 rounded-full overflow-hidden mb-4">
        <div className="bg-[#277885] h-full rounded-full transition-all duration-300" style={{ width: '66%' }} />
      </div>

      {/* Header */}
      <header className="w-full text-center mb-3">
        <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-1.5 tracking-tight">
          الخطوة ٤ من ٦
        </h2>
        <h1 className="text-[#0F263A] text-2xl sm:text-[30px] font-black leading-tight mb-2 tracking-tight">
          كيف يبدو الألم؟
        </h1>
        <p className="text-[#697A8B] text-sm sm:text-base font-medium flex items-center justify-center gap-1.5">
          <span>اسحب الرمز إلى مكان الألم</span>
          <Move className="w-4 h-4 text-[#697A8B]" />
        </p>
      </header>

      {/* Main Grid: Avatar on Left + 2x2 Sensation Grid on Right */}
      <main className="flex-1 w-full flex items-center justify-between gap-3 my-auto py-1">
        {/* Left Column: Avatar in Scrubs with Dotted Pointer */}
        <div className="relative w-[42%] max-w-[170px] flex items-center justify-center">
          <img
            src={avatarScrubs}
            alt="مجسم طبيعة الألم"
            className="w-full h-auto object-contain drop-shadow-xs pointer-events-none"
            draggable={false}
          />

          {/* Sensation Badge Connected to Shoulder */}
          <div className="absolute top-[26%] right-[-10px] sm:right-[-14px] flex items-center pointer-events-none">
            {/* Dotted Connection Line */}
            <svg className="w-10 h-10 absolute -left-7 -top-2 overflow-visible" viewBox="0 0 40 40">
              <path
                d="M 5 28 Q 18 10 35 15"
                fill="none"
                stroke="#277885"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
            </svg>

            {/* Glowing Pain Spot */}
            <div className="w-4 h-4 rounded-full bg-[#E64A19] border-2 border-white shadow-sm -ml-2 z-10" />

            {/* Floating Sensation Icon Bubble */}
            <div className="w-12 h-12 rounded-full bg-[#E2F1EE] border border-[#BCE0DA] shadow-md flex items-center justify-center z-20 transition-all duration-200">
              {React.cloneElement(activeItem.icon as React.ReactElement, { className: 'w-6 h-6 text-[#277885]' })}
            </div>
          </div>
        </div>

        {/* Right Column: 2x2 Sensation Cards */}
        <div className="w-[56%] grid grid-cols-2 gap-2.5">
          {SENSATIONS.map((s) => {
            const isSelected = s.id === selectedSensation;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelect(s.id)}
                className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-2xl transition-all duration-150 cursor-pointer text-center ${
                  isSelected
                    ? 'bg-[#E7F4F2] border-2 border-[#277885] shadow-sm scale-[1.02]'
                    : 'bg-white border border-[#EAE3D9] hover:border-[#277885]/40 hover:bg-[#FAFAF8] shadow-2xs'
                }`}
              >
                <div className="mb-2 transition-transform">{s.icon}</div>
                <span className="text-base sm:text-lg font-black text-[#0F263A]">{s.name}</span>
              </button>
            );
          })}
        </div>
      </main>

      {/* Middle Instruction Banner (Matches Mockup) */}
      <div className="w-full bg-[#E9F5F3] border border-[#CFE7E3] rounded-2xl p-3 my-3 flex items-center justify-between text-xs sm:text-sm font-bold text-[#0F263A] shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#277885]/15 flex items-center justify-center text-[#277885]">
            <Hand className="w-4 h-4" />
          </div>
          <span>اسحب الأيقونة إلى مكان الألم ثم اضغط على التالي</span>
        </div>
        <div className="w-7 h-7 rounded-lg bg-[#277885] flex items-center justify-center text-white">
          <ArrowLeft className="w-4 h-4" />
        </div>
      </div>

      {/* Error Message if any */}
      {errorMessage && (
        <div className="w-full p-2 mb-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-bold text-center">
          {errorMessage}
        </div>
      )}

      {/* Bottom Action Buttons (Matches Mockup) */}
      <footer className="w-full space-y-2.5 pt-1 pb-1">
        {/* Primary Action Button: متابعة */}
        <button
          type="button"
          onClick={handleNext}
          disabled={isSubmitting}
          className="w-full h-[54px] sm:h-[58px] rounded-2xl bg-[#0F263A] hover:bg-[#1A3850] active:scale-[0.98] text-white font-extrabold text-lg sm:text-xl shadow-sm transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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
              <ArrowLeft className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Secondary Action Button: رجوع */}
        <button
          type="button"
          onClick={() => (editingDimension ? returnToReport() : setStep('SCREEN_4_INTENSITY'))}
          className="w-full h-[52px] sm:h-[56px] rounded-2xl bg-[#D8EAE5] hover:bg-[#CADFD9] active:scale-[0.98] text-[#0F263A] font-extrabold text-lg sm:text-xl transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer border-0"
        >
          <ArrowRight className="w-5 h-5" />
          <span>رجوع</span>
        </button>
      </footer>
    </div>
  );
};

export default Screen5_Nature;
