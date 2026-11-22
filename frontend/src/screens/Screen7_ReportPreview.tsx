// frontend/src/screens/Screen7_ReportPreview.tsx
import React from 'react';
import { usePainSessionStore } from '../store/usePainSessionStore';
import { TouchButton } from '../components/common/TouchButton';
import { ArrowRight, ArrowLeft, CheckCircle2, RotateCcw, Clock, ShieldCheck, Flame } from 'lucide-react';

export const Screen7_ReportPreview: React.FC = () => {
  const {
    language,
    locations,
    timing,
    movements,
    sessionId,
    painRecordId,
    setStep,
    resetSession
  } = usePainSessionStore();

  const isAr = language === 'ar';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between p-4 sm:p-6 max-w-md mx-auto relative select-none">
      {/* Header */}
      <header className="flex items-center justify-between pb-2 border-b border-slate-200">
        <button
          onClick={() => setStep('SCREEN_6_TIME_MOVEMENT')}
          className="min-h-[48px] px-3 py-1.5 text-slate-600 hover:text-slate-900 flex items-center gap-1 text-sm font-bold active:scale-95 transition-all"
        >
          {isAr ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
          <span>{isAr ? 'رجوع' : 'Retour'}</span>
        </button>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{isAr ? 'اكتملت الأبعاد الستة (F1-F6)' : '6 Dimensions Complètes'}</span>
        </span>
      </header>

      {/* Main Content: Summary Card */}
      <main className="flex-1 flex flex-col items-center py-2 space-y-3 overflow-y-auto">
        <div className="text-center">
          <h1 className="text-xl font-extrabold text-slate-900">
            {isAr ? 'ملخص خريطة الألم السريرية' : 'Aperçu de la cartographie clinique'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {isAr
              ? 'تم تسجيل كافة أبعاد الألم بنجاح وجاهزة للتجميع النهائي (المرحلة 4)'
              : 'Données télémétriques prêtes pour le rapport final (Phase 4)'}
          </p>
        </div>

        {/* 1. Spatial & Sensation Telemetry Summary (F1 - F4) */}
        <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-900">
              {isAr ? 'المواضع والشدة والرموز (F1-F4):' : 'Localisation & Intensité (F1-F4):'}
            </span>
            <span className="text-xs font-bold text-red-600">
              {locations.length} {isAr ? 'مواضع' : 'points'}
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {locations.map((loc, idx) => (
              <div
                key={loc.locationId}
                className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: loc.intensity?.colorHex || '#E63946' }}
                    ></span>
                    <span className="font-extrabold text-slate-900">
                      {isAr ? `موضع #${idx + 1} (${loc.bodyView === 'front' ? 'أمامي' : 'خلفي'})` : `Zone #${idx + 1} (${loc.bodyView})`}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    X: {loc.coordinates.x}% | Y: {loc.coordinates.y}% | {isAr ? `الشدة: ${loc.intensity?.level || 5}/10` : `Intensité: ${loc.intensity?.level || 5}/10`}
                  </span>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-600 block">
                    {loc.radiation?.hasRadiation
                      ? isAr
                        ? 'يمتد للأطراف ↗'
                        : 'Irradiant ↗'
                      : isAr
                      ? 'موضعي فقط'
                      : 'Localisé'}
                  </span>
                  <span className="text-[10px] text-purple-700 font-semibold">
                    {loc.sensations?.length ? `${loc.sensations.length} ${isAr ? 'رموز حسية' : 'sensations'}` : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Temporal & Postures Summary (F5 - F6) */}
        <div className="w-full bg-white border border-slate-200 rounded-3xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="text-xs font-extrabold text-slate-900">
              {isAr ? 'التوقيت والحركات المحفزة (F5-F6):' : 'Rythme & Postures (F5-F6):'}
            </span>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>

          <div className="text-xs space-y-1.5 pt-1">
            <div className="flex justify-between">
              <span className="text-slate-500">{isAr ? 'ساعات الذروة:' : 'Heures de pic:'}</span>
              <span className="font-bold text-slate-800">
                {timing.onsetHours.length > 0
                  ? timing.onsetHours.map((h) => `${h}h`).join(', ')
                  : isAr
                  ? 'غير محدد'
                  : 'Non spécifié'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{isAr ? 'النمط والتواتر:' : 'Fréquence:'}</span>
              <span className="font-bold text-slate-800">{timing.frequency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">{isAr ? 'الوضعيات المحفزة:' : 'Postures aggravantes:'}</span>
              <span className="font-bold text-red-600">
                {movements.length > 0
                  ? `${movements.length} ${isAr ? 'حركات صعبة' : 'postures'}`
                  : isAr
                  ? 'لا توجد حركات محفزة'
                  : 'Aucune'}
              </span>
            </div>
          </div>
        </div>

        {/* Diagnostic Meta */}
        <div className="w-full p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-[11px] text-emerald-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>
            {isAr
              ? `المرحلتان 2 و 3 مكتملتان بنجاح — السجل: ${painRecordId?.slice(0, 8)}...`
              : `Phases 2 & 3 validées avec succès — Record: ${painRecordId?.slice(0, 8)}...`}
          </span>
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="pt-2">
        <TouchButton
          variant="outline"
          onClick={resetSession}
          icon={<RotateCcw className="w-4 h-4" />}
          className="w-full text-slate-700"
        >
          {isAr ? 'بدء جلسة جديدة من البداية' : 'Recommencer une nouvelle session'}
        </TouchButton>
      </footer>
    </div>
  );
};
