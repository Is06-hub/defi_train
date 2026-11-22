// frontend/src/components/timeline/DayClockTimeline.tsx
import React from 'react';
import { usePainSessionStore } from '../../store/usePainSessionStore';
import { Sun, Sunset, Moon, Sunrise, Clock, Sparkles } from 'lucide-react';

export const DayClockTimeline: React.FC = () => {
  const { language, timing, toggleHour, setFrequency } = usePainSessionStore();
  const isAr = language === 'ar';

  const dayPeriods = [
    {
      id: 'morning',
      labelAr: 'الصباح (06 - 12)',
      labelFr: 'Matin (06h - 12h)',
      hours: [6, 7, 8, 9, 10, 11],
      icon: <Sunrise className="w-4 h-4 text-amber-500" />,
      bgClass: 'bg-amber-50/50 border-amber-200/80'
    },
    {
      id: 'afternoon',
      labelAr: 'الظهيرة (12 - 17)',
      labelFr: 'Après-midi (12h - 17h)',
      hours: [12, 13, 14, 15, 16],
      icon: <Sun className="w-4 h-4 text-orange-500" />,
      bgClass: 'bg-orange-50/50 border-orange-200/80'
    },
    {
      id: 'evening',
      labelAr: 'المساء (17 - 22)',
      labelFr: 'Soir (17h - 22h)',
      hours: [17, 18, 19, 20, 21],
      icon: <Sunset className="w-4 h-4 text-purple-500" />,
      bgClass: 'bg-purple-50/50 border-purple-200/80'
    },
    {
      id: 'night',
      labelAr: 'الليل (22 - 06)',
      labelFr: 'Nuit (22h - 06h)',
      hours: [22, 23, 0, 1, 2, 3, 4, 5],
      icon: <Moon className="w-4 h-4 text-indigo-500" />,
      bgClass: 'bg-indigo-50/50 border-indigo-200/80'
    }
  ];

  const frequencies = [
    { id: 'daily', labelAr: 'نوبات متكررة يومياً', labelFr: 'Épisodes quotidiens' },
    { id: 'constant', labelAr: 'ألم مستمر متواصل 24h', labelFr: 'Permanent continu' },
    { id: 'morning_peak', labelAr: 'ذروة صباحية عند الاستيقاظ', labelFr: 'Pic matinal réveil' },
    { id: 'evening_peak', labelAr: 'ذروة مسائية بعد المجهود', labelFr: 'Pic fin de journée' }
  ];

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <Clock className="w-4 h-4" />
          </div>
          <span className="text-sm font-black text-slate-900">
            {isAr ? 'ساعات ذروة الألم خلال 24 ساعة (F5)' : 'Rythme circadien sur 24h (F5)'}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
          {timing.onsetHours.length} {isAr ? 'ساعات' : 'h'}
        </span>
      </div>

      {/* 4 Periods Timeline Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {dayPeriods.map((period) => (
          <div key={period.id} className={`p-3 rounded-2xl border transition-all ${period.bgClass}`}>
            <div className="flex items-center gap-1.5 mb-2">
              {period.icon}
              <span className="text-xs font-extrabold text-slate-800">
                {isAr ? period.labelAr : period.labelFr}
              </span>
            </div>

            {/* Hours Pills in Period */}
            <div className="flex flex-wrap gap-1">
              {period.hours.map((hour) => {
                const isSelected = timing.onsetHours.includes(hour);
                return (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => toggleHour(hour)}
                    className={`min-w-[32px] h-7 px-1.5 rounded-lg text-xs font-mono font-bold transition-all active:scale-95 cursor-pointer ${
                      isSelected
                        ? 'bg-red-600 text-white shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {hour.toString().padStart(2, '0')}h
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pattern & Frequency Selector */}
      <div className="pt-1">
        <span className="text-xs font-black text-slate-700 block mb-2">
          {isAr ? 'نمط التكرار والتواتر السريري:' : 'Schéma de survenue clinique:'}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {frequencies.map((freq) => (
            <button
              key={freq.id}
              type="button"
              onClick={() => setFrequency(freq.id)}
              className={`min-h-[44px] px-3 py-2 rounded-2xl text-xs font-black border transition-all text-right rtl:text-right ltr:text-left active:scale-[0.98] cursor-pointer ${
                timing.frequency === freq.id
                  ? 'bg-red-50 border-red-400 text-red-900 shadow-xs ring-1 ring-red-400'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {isAr ? freq.labelAr : freq.labelFr}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
