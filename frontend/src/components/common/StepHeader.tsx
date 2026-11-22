// frontend/src/components/common/StepHeader.tsx
import React from 'react';
import { usePainSessionStore, StepName } from '../../store/usePainSessionStore';
import { ArrowLeft, ArrowRight, Globe, RotateCcw, Sparkles, Check, Undo2 } from 'lucide-react';

interface StepHeaderProps {
  currentStepIndex: number; // 1 to 6
  stepTitleAr: string;
  stepTitleFr: string;
  onBack?: () => void;
  showLanguageToggle?: boolean;
}

export const StepHeader: React.FC<StepHeaderProps> = ({
  currentStepIndex,
  stepTitleAr,
  stepTitleFr,
  onBack,
  showLanguageToggle = true
}) => {
  const { language, setLanguage, editingDimension, returnToReport, resetSession } = usePainSessionStore();
  const isAr = language === 'ar';

  const stepsList = [
    { num: 1, labelAr: 'الموضع', labelFr: 'Zone' },
    { num: 2, labelAr: 'الامتداد', labelFr: 'Rayon' },
    { num: 3, labelAr: 'الشدة', labelFr: 'Intensité' },
    { num: 4, labelAr: 'الطبيعة', labelFr: 'Nature' },
    { num: 5, labelAr: 'الحركات', labelFr: 'Postures' },
    { num: 6, labelAr: 'التقرير', labelFr: 'Bilan' }
  ];

  const toggleLanguage = () => {
    setLanguage(isAr ? 'fr' : 'ar');
  };

  return (
    <header className="w-full pb-3 mb-2 border-b border-slate-200/80 transition-all select-none">
      {/* Top Bar: Nav Button + Stepper Badge + Lang Switch */}
      <div className="flex items-center justify-between gap-2">
        {/* Back / Cancel Button */}
        {editingDimension ? (
          <button
            onClick={returnToReport}
            className="min-h-[44px] px-3 py-1.5 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-black flex items-center gap-1.5 transition-all active:scale-95 border border-indigo-200 shadow-xs cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
            <span>{isAr ? 'إلغاء والعودة للتقرير' : 'Retour au bilan'}</span>
          </button>
        ) : onBack ? (
          <button
            onClick={onBack}
            className="min-h-[44px] px-3 py-1.5 rounded-2xl text-slate-600 hover:text-slate-900 hover:bg-slate-100/80 text-xs sm:text-sm font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'رجوع' : 'Retour'}</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-black text-slate-900 tracking-tight text-sm sm:text-base">PainVisual</span>
          </div>
        )}

        {/* Step Badge */}
        <div className="flex items-center gap-1.5">
          <div className="px-3 py-1 rounded-full text-xs font-black border transition-all bg-white shadow-xs border-slate-200 text-slate-800">
            {editingDimension ? (
              <span className="text-indigo-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
                {isAr ? 'وضع التعديل الفوري (F8)' : 'Édition rapide (F8)'}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <span className="text-red-600 font-mono font-black">{currentStepIndex}/6</span>
                <span className="hidden sm:inline text-slate-400">•</span>
                <span className="text-slate-700">{isAr ? stepTitleAr : stepTitleFr}</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions (Language Switcher / Restart) */}
        <div className="flex items-center gap-1.5">
          {showLanguageToggle && (
            <button
              onClick={toggleLanguage}
              className="min-h-[40px] px-2.5 py-1 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 text-xs font-bold flex items-center gap-1 transition-all shadow-2xs active:scale-95 cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>{isAr ? 'FR' : 'عربي'}</span>
            </button>
          )}

          {currentStepIndex > 1 && (
            <button
              onClick={resetSession}
              className="min-h-[40px] w-9 h-9 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-all active:scale-95 cursor-pointer"
              title={isAr ? 'إعادة تعيين الجلسة' : 'Réinitialiser'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Modern 6-Step Visual Stepper Bar */}
      <div className="mt-2.5 pt-1">
        <div className="grid grid-cols-6 gap-1.5 items-center">
          {stepsList.map((step) => {
            const isCompleted = step.num < currentStepIndex;
            const isCurrent = step.num === currentStepIndex;

            return (
              <div key={step.num} className="flex flex-col gap-1">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    isCurrent
                      ? 'bg-red-600 shadow-glow-sm'
                      : isCompleted
                      ? 'bg-emerald-500'
                      : 'bg-slate-200'
                  }`}
                />
                <span
                  className={`text-[9px] text-center font-bold truncate hidden sm:block ${
                    isCurrent
                      ? 'text-red-600'
                      : isCompleted
                      ? 'text-emerald-700'
                      : 'text-slate-400'
                  }`}
                >
                  {isAr ? step.labelAr : step.labelFr}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </header>
  );
};
