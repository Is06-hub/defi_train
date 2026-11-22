// frontend/src/components/report/VisualReportCard.tsx
import React, { useState } from 'react';
import { usePainSessionStore } from '../../store/usePainSessionStore';
import { AnatomicalBodySvg } from '../canvas/AnatomicalBodySvg';
import { Flame, Compass, Zap, Activity, Clock, ShieldCheck, MapPin, Copy, Check, Eye, Stethoscope, Share2 } from 'lucide-react';

interface VisualReportCardProps {
  clinicCode?: string;
}

export const VisualReportCard: React.FC<VisualReportCardProps> = ({ clinicCode }) => {
  const { language, locations, timing, movements, reportData } = usePainSessionStore();
  const isAr = language === 'ar';
  const [copied, setCopied] = useState(false);
  const [doctorMode, setDoctorMode] = useState(false);

  const maxIntensity = locations.reduce((max, l) => Math.max(max, l.intensity?.level || 5), 0);
  const highestLocation = locations.find((l) => (l.intensity?.level || 0) === maxIntensity) || locations[0];
  const primaryColor = highestLocation?.intensity?.colorHex || '#E63946';

  const hasRadiation = locations.some((l) => l.radiation?.hasRadiation);
  const allSensations = Array.from(new Set(locations.flatMap((l) => l.sensations?.map((s) => s.type) || [])));

  const sensationLabels: Record<string, { ar: string; fr: string }> = {
    burning: { ar: 'حارق ولهيب', fr: 'Brûlure' },
    pricking: { ar: 'وخز وتنميل', fr: 'Picotements' },
    throbbing: { ar: 'نابض وخفقان', fr: 'Pulsatile' },
    stabbing: { ar: 'طعن حاد', fr: 'Poignardement' },
    heavy_ache: { ar: 'ثقل وضغط خانق', fr: 'Lourdeur' }
  };

  const movementLabels: Record<string, { ar: string; fr: string }> = {
    bending: { ar: 'الانحناء للأمام', fr: 'Flexion avant' },
    raising_arm: { ar: 'رفع الذراع للأعلى', fr: 'Élévation bras' },
    walking: { ar: 'المشي أو الوقوف المستمر', fr: 'Marche / Station debout' },
    sitting: { ar: 'الجلوس لفترة طويلة', fr: 'Assise prolongée' },
    twisting: { ar: 'التفاف الجذع', fr: 'Torsion du buste' }
  };

  const code = clinicCode || reportData?.clinicCode || 'PV-4981';

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`w-full rounded-3xl transition-all duration-300 p-4 sm:p-6 border-2 shadow-sm space-y-5 ${
      doctorMode
        ? 'bg-slate-900 text-white border-slate-700 shadow-xl'
        : 'bg-white text-slate-900 border-slate-200/90'
    }`}>
      {/* Top Header: Clinic Code Pass & Doctor Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/25">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                {isAr ? 'كود الفحص السريري المعتمد' : 'Code Consultation Médicale'}
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-2xl font-black font-mono tracking-widest text-indigo-600 dark:text-indigo-400">
                {code}
              </span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 active:scale-95 transition-all cursor-pointer"
                title={isAr ? 'نسخ الكود' : 'Copier'}
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Doctor Presentation Mode Toggle */}
        <button
          type="button"
          onClick={() => setDoctorMode(!doctorMode)}
          className={`min-h-[40px] px-3.5 py-1.5 rounded-2xl text-xs font-black flex items-center gap-2 transition-all active:scale-95 cursor-pointer self-start sm:self-auto ${
            doctorMode
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>{doctorMode ? (isAr ? 'الوضع العادي' : 'Mode Patient') : (isAr ? 'وضع عرض الطبيب' : 'Mode Médecin')}</span>
        </button>
      </div>

      {/* Dual-View Body Telemetry Mini Map (Front & Back) */}
      <div className="space-y-2">
        <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">
          {isAr ? 'الخريطة البصرية المزدوجة (وجه / ظهر):' : 'Cartographie anatomique double (Face / Dos):'}
        </span>
        <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
          {/* Front Silhouette */}
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black uppercase text-slate-400 mb-1">
              {isAr ? 'أمامي (Face)' : 'Vue Face'}
            </span>
            <div className="w-full max-w-[130px] h-[180px]">
              <AnatomicalBodySvg
                view="front"
                locations={locations}
                interactive={false}
                showRadiations={true}
              />
            </div>
          </div>

          {/* Back Silhouette */}
          <div className="flex flex-col items-center border-l border-slate-200 dark:border-slate-700 rtl:border-r rtl:border-l-0">
            <span className="text-[10px] font-black uppercase text-slate-400 mb-1">
              {isAr ? 'خلفي (Dos)' : 'Vue Dos'}
            </span>
            <div className="w-full max-w-[130px] h-[180px]">
              <AnatomicalBodySvg
                view="back"
                locations={locations}
                interactive={false}
                showRadiations={true}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 4 Critical Clinical Telemetry Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {/* Metric 1: Max Intensity */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black text-slate-400">
              {isAr ? 'الشدة القصوى' : 'Intensité Max'}
            </span>
            <Flame className="w-4 h-4" style={{ color: primaryColor }} />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black font-mono leading-none" style={{ color: primaryColor }}>
              {maxIntensity}
            </span>
            <span className="text-[10px] text-slate-400 font-bold">/ 10</span>
          </div>
        </div>

        {/* Metric 2: Radiation */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black text-slate-400">
              {isAr ? 'مسار الامتداد' : 'Irradiation'}
            </span>
            <Compass className="w-4 h-4 text-sky-500" />
          </div>
          <span className="text-xs font-black truncate">
            {hasRadiation ? (isAr ? 'يمتد للأطراف ↗' : 'Rayonnant ↗') : (isAr ? 'موضعي فقط' : 'Localisé')}
          </span>
        </div>

        {/* Metric 3: Timing Peak */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black text-slate-400">
              {isAr ? 'ذروة التوقيت' : 'Pic horaire'}
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <span className="text-xs font-black font-mono">
            {timing.onsetHours.length > 0
              ? `${timing.onsetHours[0].toString().padStart(2, '0')}:00`
              : '07:00'}
          </span>
        </div>

        {/* Metric 4: Movement Restriction */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-black text-slate-400">
              {isAr ? 'حركات مقيدة' : 'Postures'}
            </span>
            <Activity className="w-4 h-4 text-rose-500" />
          </div>
          <span className="text-xs font-black">
            {movements.length} {isAr ? 'وضعيات' : 'restreints'}
          </span>
        </div>
      </div>

      {/* Sensation Nature Badges */}
      {allSensations.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">
            {isAr ? 'طبيعة ورموز الألم السائدة:' : 'Sensations dominantes observées:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {allSensations.map((sens) => (
              <span
                key={sens}
                className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 text-xs font-bold"
              >
                {sensationLabels[sens]?.[isAr ? 'ar' : 'fr'] || sens}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Provocative Movements List */}
      {movements.length > 0 && (
        <div className="space-y-1.5">
          <span className="text-xs font-black uppercase text-slate-400 tracking-wider block">
            {isAr ? 'الحركات والوضعيات المحفزة للألم:' : 'Mouvements aggravants:'}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {movements.map((mov) => (
              <span
                key={mov.movementId}
                className="px-3 py-1 rounded-xl bg-rose-50 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-bold flex items-center gap-1"
              >
                <span>{movementLabels[mov.movementId]?.[isAr ? 'ar' : 'fr'] || mov.movementId}</span>
                <span className="text-[10px] font-mono opacity-75">
                  ({mov.severity === 'severe' ? (isAr ? 'شديد' : 'sévère') : (isAr ? 'متوسط' : 'modéré')})
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
