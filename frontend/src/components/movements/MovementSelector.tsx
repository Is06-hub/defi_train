// frontend/src/components/movements/MovementSelector.tsx
import React from 'react';
import { usePainSessionStore } from '../../store/usePainSessionStore';
import { Accessibility, Footprints, Armchair, RotateCw, ArrowUpCircle, Activity, Check } from 'lucide-react';

export const MovementSelector: React.FC = () => {
  const { language, movements, toggleMovement } = usePainSessionStore();
  const isAr = language === 'ar';

  const postures = [
    {
      id: 'bending',
      nameAr: 'الانحناء للأمام',
      nameFr: 'Flexion vers l’avant',
      descAr: 'الركوع أو التقاط الأشياء من الأرض',
      descFr: 'Ramasser un objet au sol',
      icon: <Accessibility className="w-5 h-5 text-red-600" />
    },
    {
      id: 'raising_arm',
      nameAr: 'رفع الذراع للأعلى',
      nameFr: 'Élévation du bras',
      descAr: 'الوصول لرف عالٍ أو ارتداء الملابس',
      descFr: 'Lever le bras au-dessus de l’épaule',
      icon: <ArrowUpCircle className="w-5 h-5 text-orange-600" />
    },
    {
      id: 'walking',
      nameAr: 'المشي أو الوقوف المستمر',
      nameFr: 'Marche / Station debout',
      descAr: 'المشي أكثر من 10 دقائق أو الوقوف',
      descFr: 'Marcher ou rester debout prolongé',
      icon: <Footprints className="w-5 h-5 text-emerald-600" />
    },
    {
      id: 'sitting',
      nameAr: 'الجلوس لفترة طويلة',
      nameFr: 'Assise prolongée',
      descAr: 'الجلوس في المكتب أو قيادة السيارة',
      descFr: 'Travailler assis ou conduire',
      icon: <Armchair className="w-5 h-5 text-indigo-600" />
    },
    {
      id: 'twisting',
      nameAr: 'التفاف الجذع والدوران',
      nameFr: 'Torsion du buste',
      descAr: 'الالتفاف يميناً أو يساراً في الفراش',
      descFr: 'Rotation du tronc ou se retourner',
      icon: <RotateCw className="w-5 h-5 text-purple-600" />
    }
  ];

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-50 text-red-600 flex items-center justify-center">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-sm font-black text-slate-900">
            {isAr ? 'الحركات والوضعيات المحفزة للألم (F6)' : 'Postures aggravantes (F6)'}
          </span>
        </div>
        <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full border border-red-200">
          {movements.length} {isAr ? 'حركات' : 'postures'}
        </span>
      </div>

      {/* Grid of Posture Cards */}
      <div className="space-y-2">
        {postures.map((posture) => {
          const selectedItem = movements.find((m) => m.movementId === posture.id);
          const isSelected = Boolean(selectedItem);
          const isSevere = selectedItem?.severity === 'severe';

          return (
            <div
              key={posture.id}
              className={`p-3 rounded-2xl border transition-all duration-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 ${
                isSelected
                  ? 'bg-rose-50/70 border-red-300 shadow-2xs ring-1 ring-red-300'
                  : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleMovement(posture.id, 'severe')}
                className="flex items-center gap-3 text-right rtl:text-right ltr:text-left flex-1 min-h-[44px] cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs flex-shrink-0">
                  {posture.icon}
                </div>
                <div>
                  <span className="text-xs sm:text-sm font-black text-slate-900 block leading-tight">
                    {isAr ? posture.nameAr : posture.nameFr}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                    {isAr ? posture.descAr : posture.descFr}
                  </span>
                </div>
              </button>

              {/* Severity Level Quick Toggle Pill */}
              <div className="flex items-center gap-1.5 self-end sm:self-center">
                {isSelected ? (
                  <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-red-200 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => toggleMovement(posture.id, 'moderate')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        !isSevere
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {isAr ? 'متوسط' : 'Modéré'}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleMovement(posture.id, 'severe')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                        isSevere
                          ? 'bg-red-600 text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {isAr ? 'شديد جداً' : 'Sévère'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => toggleMovement(posture.id, 'severe')}
                    className="min-h-[36px] px-3 py-1 rounded-xl border border-slate-300 text-[11px] font-bold text-slate-600 hover:bg-white active:scale-95 transition-all cursor-pointer"
                  >
                    {isAr ? 'إضافة' : 'Ajouter'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
