// frontend/src/components/report/QuickEditButtons.tsx
import React from 'react';
import { usePainSessionStore } from '../../store/usePainSessionStore';
import { Edit3, MapPin, Compass, Flame, Zap, Clock, Undo2 } from 'lucide-react';

export const QuickEditButtons: React.FC = () => {
  const { language, quickEditDimension } = usePainSessionStore();
  const isAr = language === 'ar';

  const editItems = [
    {
      id: 'location' as const,
      icon: <MapPin className="w-4 h-4 text-emerald-600" />,
      labelAr: 'تعديل المواضع',
      labelFr: 'Modifier Zones',
      bgClass: 'bg-emerald-50/70 hover:bg-emerald-100/80 text-emerald-900 border-emerald-200/80'
    },
    {
      id: 'radiation' as const,
      icon: <Compass className="w-4 h-4 text-sky-600" />,
      labelAr: 'تعديل الانتشار',
      labelFr: 'Modifier Rayon',
      bgClass: 'bg-sky-50/70 hover:bg-sky-100/80 text-sky-900 border-sky-200/80'
    },
    {
      id: 'intensity' as const,
      icon: <Flame className="w-4 h-4 text-rose-600" />,
      labelAr: 'تعديل الشدة',
      labelFr: 'Modifier Intensité',
      bgClass: 'bg-rose-50/70 hover:bg-rose-100/80 text-rose-900 border-rose-200/80'
    },
    {
      id: 'nature' as const,
      icon: <Zap className="w-4 h-4 text-purple-600" />,
      labelAr: 'تعديل الرموز',
      labelFr: 'Modifier Sensations',
      bgClass: 'bg-purple-50/70 hover:bg-purple-100/80 text-purple-900 border-purple-200/80'
    },
    {
      id: 'timing' as const,
      icon: <Clock className="w-4 h-4 text-amber-600" />,
      labelAr: 'تعديل التوقيت والحركات',
      labelFr: 'Modifier Horaires',
      bgClass: 'bg-amber-50/70 hover:bg-amber-100/80 text-amber-900 border-amber-200/80'
    }
  ];

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Edit3 className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-black text-slate-900">
            {isAr ? 'تعديل فوري بنقرة واحدة (F8):' : 'Modification Rétroactive Rapide (F8):'}
          </h3>
        </div>
        <span className="text-[10px] text-slate-400 font-bold">
          {isAr ? 'تعديل بعد واحد مع حفظ البقية' : 'Sans perdre les autres dimensions'}
        </span>
      </div>

      {/* Grid of Edit Dimension Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {editItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => quickEditDimension(item.id)}
            className={`min-h-[48px] px-3 py-2 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all active:scale-95 shadow-2xs cursor-pointer ${item.bgClass}`}
          >
            {item.icon}
            <span className="truncate">{isAr ? item.labelAr : item.labelFr}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
