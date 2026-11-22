// frontend/src/screens/Screen7_VisualReport.tsx
import React, { useEffect, useState } from 'react';
import { usePainSessionStore } from '../store/usePainSessionStore';
import avatarReport from '../assets/avatar_report.png';
import doctorBadge from '../assets/doctor_badge.png';
import {
  MapPin,
  ArrowDown,
  Gauge,
  Flame,
  Clock,
  ChevronLeft,
  Send,
  Bookmark,
  Lock,
  Pencil,
  CheckCircle,
  Flower2
} from 'lucide-react';

export const Screen7_VisualReport: React.FC = () => {
  const {
    locations,
    timing,
    reportData,
    generateClinicalReport,
    setStep,
    quickEditDimension,
    isSubmitting
  } = usePainSessionStore();

  const [isSent, setIsSent] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (!reportData) {
      generateClinicalReport();
    }
  }, [reportData]);

  const targetLocation = locations[0];
  const intensityLevel = targetLocation?.intensity?.level || 8;
  const intensityDesc = intensityLevel >= 8 ? 'شديدة' : intensityLevel >= 5 ? 'متوسطة' : 'خفيفة';
  const sensationType = targetLocation?.sensations?.[0]?.type || 'حرقان';
  const sensationDesc = sensationType === 'burning' ? 'حرقان' : sensationType === 'pricking' ? 'وخز' : sensationType === 'throbbing' ? 'نبض' : 'ضغط';

  const summaryItems = [
    {
      id: 'location',
      label: 'المكان',
      value: 'الكتف الأيسر',
      icon: <MapPin className="w-5 h-5 text-white" />,
      iconBg: 'bg-[#E26153]',
      step: 'SCREEN_2_LOCATION' as const,
    },
    {
      id: 'radiation',
      label: 'الأمتداد',
      value: 'إلى الركبة',
      icon: <ArrowDown className="w-5 h-5 text-white" />,
      iconBg: 'bg-[#277885]',
      step: 'SCREEN_3_RADIATION' as const,
    },
    {
      id: 'intensity',
      label: 'الشدة',
      value: intensityDesc,
      icon: <Gauge className="w-5 h-5 text-white" />,
      iconBg: 'bg-[#0F263A]',
      step: 'SCREEN_4_INTENSITY' as const,
    },
    {
      id: 'nature',
      label: 'الطبيعة',
      value: sensationDesc,
      icon: <Flame className="w-5 h-5 text-white" />,
      iconBg: 'bg-[#E26153]',
      step: 'SCREEN_5_NATURE' as const,
    },
    {
      id: 'time',
      label: 'الوقت',
      value: 'صباحاً ويتكرر',
      icon: <Clock className="w-5 h-5 text-white" />,
      iconBg: 'bg-[#277885]',
      step: 'SCREEN_6_TIME_MOVEMENT' as const,
    },
  ];

  const handleEdit = (dimension: any, step: any) => {
    quickEditDimension(dimension);
    setStep(step);
  };

  const handleSend = () => {
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F263A] flex flex-col justify-between items-center px-5 py-5 sm:py-6 max-w-md mx-auto select-none font-sans" dir="rtl">
      {/* Top Header */}
      <header className="w-full relative pt-1">
        {/* Top Right Clinic Logo */}
        <div className="w-full flex items-center justify-between mb-2">
          <div className="text-right">
            <h1 className="text-[#0F263A] text-2xl sm:text-[28px] font-black leading-tight tracking-tight">
              ملخص وصف الألم
            </h1>
            <p className="text-[#697A8B] text-xs sm:text-sm font-medium mt-0.5">
              راجع المعلومات قبل مشاركتها
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-right">
            <span className="text-xs font-black text-[#0F263A] leading-tight">
              عيادة
              <br />
              الشفاء
            </span>
            <div className="w-9 h-9 rounded-full bg-[#E5F2F0] flex items-center justify-center border border-[#CFE7E3]">
              <Flower2 className="w-5 h-5 text-[#277885]" />
            </div>
          </div>
        </div>

        {/* Doctor Badge + Edit Trigger (Left Side matching Mockup) */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full p-1 bg-white border border-[#E8E2D9] shadow-2xs flex items-center justify-center">
              <img src={doctorBadge} alt="الطبيب المعالج" className="w-full h-full object-contain" />
            </div>
            <button
              type="button"
              onClick={() => handleEdit('location', 'SCREEN_2_LOCATION')}
              className="mt-1 flex items-center gap-1 text-xs font-black text-[#277885] hover:underline cursor-pointer"
            >
              <span>تعديل</span>
              <Pencil className="w-3 h-3" />
            </button>
          </div>

          {/* Top Center-Right: Avatar with Radiation to Knee */}
          <div className="relative w-36 sm:w-40 flex items-center justify-center">
            <img
              src={avatarReport}
              alt="ملخص التقرير البصري"
              className="w-full h-auto object-contain drop-shadow-xs pointer-events-none"
            />
          </div>
        </div>
      </header>

      {/* Main 5 Summary Cards */}
      <main className="w-full my-auto py-2 space-y-2">
        {summaryItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleEdit(item.id, item.step)}
            className="w-full bg-white rounded-2xl p-3 px-4 shadow-[0_2px_12px_rgba(0,0,0,0.03)] border border-[#ECE5DC] flex items-center justify-between transition-all hover:border-[#277885]/40 hover:bg-[#FAFAF8] cursor-pointer"
          >
            {/* Left Chevron (in RTL) */}
            <div className="text-[#8D9AA6]">
              <ChevronLeft className="w-5 h-5" />
            </div>

            {/* Label and Value */}
            <div className="flex-1 text-right pr-3 font-extrabold text-sm sm:text-base text-[#0F263A]">
              <span>{item.label}</span>
              <span className="text-[#8D9AA6] mx-1.5">—</span>
              <span className="text-[#0F263A]">{item.value}</span>
            </div>

            {/* Right Icon Circle */}
            <div className={`w-9 h-9 rounded-full ${item.iconBg} flex items-center justify-center shadow-xs`}>
              {item.icon}
            </div>
          </div>
        ))}
      </main>

      {/* Privacy Guarantee Note */}
      <div className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#8D9AA6] py-1">
        <span>لن تتم المشاركة دون موافقتك</span>
        <Lock className="w-3.5 h-3.5 text-[#8D9AA6]" />
      </div>

      {/* Success Notification if Sent or Saved */}
      {isSent && (
        <div className="w-full p-2.5 mb-1.5 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-700 text-xs font-black text-center flex items-center justify-center gap-1.5 animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>تم إرسال التقرير الطبي للطبيب بنجاح! كود العيادة: PV-4981</span>
        </div>
      )}

      {isSaved && (
        <div className="w-full p-2 mb-1.5 bg-blue-50 border border-blue-200 rounded-xl text-[#277885] text-xs font-black text-center">
          تم حفظ نسخة التقرير على هاتفك بنجاح.
        </div>
      )}

      {/* Bottom CTA Buttons */}
      <footer className="w-full space-y-2 pt-1 pb-1">
        {/* Primary Action Button: إرسال للطبيب */}
        <button
          type="button"
          onClick={handleSend}
          disabled={isSubmitting}
          className="w-full h-[54px] sm:h-[58px] rounded-2xl bg-gradient-to-r from-[#0F263A] to-[#277885] hover:opacity-95 active:scale-[0.98] text-white font-extrabold text-lg sm:text-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>إرسال للطبيب</span>
          <Send className="w-5 h-5 -rotate-45" />
        </button>

        {/* Secondary Action Button: حفظ التقرير */}
        <button
          type="button"
          onClick={handleSave}
          className="w-full h-[52px] sm:h-[56px] rounded-2xl bg-white border border-[#0F263A]/80 hover:bg-black/5 active:scale-[0.98] text-[#0F263A] font-extrabold text-lg sm:text-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>حفظ التقرير</span>
          <Bookmark className="w-5 h-5" />
        </button>
      </footer>
    </div>
  );
};

export default Screen7_VisualReport;
