import os
import base64

def get_b64(name):
    with open(f'c:/Users/MO/Desktop/defi_train/frontend/public/assets/{name}.png', 'rb') as f:
        return base64.b64encode(f.read()).decode('ascii')

b64_map = {
    'welcome': get_b64('avatar_welcome'),
    'clean': get_b64('avatar_clean'),
    'radiation': get_b64('avatar_radiation'),
    'intensity': get_b64('avatar_intensity'),
    'scrubs': get_b64('avatar_scrubs'),
    'mini_avatar': get_b64('mini_avatar'),
    'bending': get_b64('movement_bending'),
    'arm': get_b64('movement_arm'),
    'walking': get_b64('movement_walking'),
    'standing': get_b64('movement_standing'),
    'report': get_b64('avatar_report'),
    'doctor': get_b64('doctor_badge'),
}

template = '''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <title>PainVisual — نبض الألم (العرض المتكامل لكافة الشاشات)</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Cairo', 'system-ui', 'sans-serif'],
            mono: ['ui-monospace', 'monospace']
          }
        }
      }
    };
  </script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body {
      background-color: #FAF7F2;
      font-family: 'Cairo', system-ui, sans-serif;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
    }
  </style>
</head>
<body class="antialiased min-h-screen text-[#0F263A] bg-[#FAF7F2]">
  <div id="root"></div>

  <script type="text/babel">
    const { useState, useEffect } = React;

    const ASSETS = {
      welcome: "data:image/png;base64,__B64_WELCOME__",
      clean: "data:image/png;base64,__B64_CLEAN__",
      radiation: "data:image/png;base64,__B64_RADIATION__",
      intensity: "data:image/png;base64,__B64_INTENSITY__",
      scrubs: "data:image/png;base64,__B64_SCRUBS__",
      miniAvatar: "data:image/png;base64,__B64_MINI_AVATAR__",
      bending: "data:image/png;base64,__B64_BENDING__",
      arm: "data:image/png;base64,__B64_ARM__",
      walking: "data:image/png;base64,__B64_WALKING__",
      standing: "data:image/png;base64,__B64_STANDING__",
      report: "data:image/png;base64,__B64_REPORT__",
      doctor: "data:image/png;base64,__B64_DOCTOR__",
    };

    const SWATCHES = [
      { level: 2, hex: '#F8D5C2', label: 'خفيف' },
      { level: 4, hex: '#F6A882', label: 'متوسط خفيف' },
      { level: 6, hex: '#F17A4A', label: 'متوسط' },
      { level: 8, hex: '#E84C4C', label: 'شديد' },
      { level: 10, hex: '#DE3C36', label: 'أقصى' }
    ];

    const SENSATIONS = [
      { id: 'pricking', name: 'وخز', icon: '⚡' },
      { id: 'throbbing', name: 'نبض', icon: '📈' },
      { id: 'burning', name: 'حرقان', icon: '🔥' },
      { id: 'pressure', name: 'ضغط', icon: '🫁' }
    ];

    const MOVEMENTS = [
      { id: 'bending', name: 'الانحناء', img: ASSETS.bending },
      { id: 'raising_arm', name: 'رفع الذراع', img: ASSETS.arm },
      { id: 'walking', name: 'المشي', img: ASSETS.walking },
      { id: 'standing', name: 'الوقوف', img: ASSETS.standing },
    ];

    function App() {
      const [step, setStep] = useState(1);
      const [view, setView] = useState('front');
      const [activePoint, setActivePoint] = useState({ x: 59, y: 32 });
      const [selectedLevel, setSelectedLevel] = useState(8);
      const [selectedSensation, setSelectedSensation] = useState('burning');
      const [selectedMovement, setSelectedMovement] = useState('raising_arm');
      const [frequency, setFrequency] = useState('multiple');
      const [isSent, setIsSent] = useState(false);

      const activeSwatch = SWATCHES.find(s => s.level === selectedLevel) || SWATCHES[3];

      const handleCanvasClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        const clickY = Math.round(((e.clientY - rect.top) / rect.height) * 100);
        setActivePoint({ x: clickX, y: clickY });
      };

      const stepTitles = [
        { num: 1, name: 'الترحيب' },
        { num: 2, name: 'الموضع' },
        { num: 3, name: 'الامتداد' },
        { num: 4, name: 'الشدة' },
        { num: 5, name: 'الطبيعة' },
        { num: 6, name: 'التوقيت' },
        { num: 7, name: 'الحركات' },
        { num: 8, name: 'التقرير' }
      ];

      return (
        <div className="min-h-screen flex flex-col justify-center items-center p-2 sm:p-4">
          {/* Quick Navigation Bar */}
          <div className="w-full max-w-md flex items-center justify-between px-3 py-2 mb-2 bg-white/80 rounded-2xl border border-[#EBE5DC] text-xs font-bold text-[#697A8B] overflow-x-auto shadow-2xs">
            <span className="shrink-0 ml-2">الشاشات:</span>
            <div className="flex items-center gap-1 shrink-0">
              {stepTitles.map((s) => (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  className={`px-2 py-1 rounded-xl transition-all cursor-pointer ${
                    step === s.num ? 'bg-[#277885] text-white shadow-xs' : 'hover:bg-black/5 text-[#0F263A]'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full max-w-md bg-[#FAF7F2] rounded-[40px] p-5 sm:p-6 min-h-[760px] flex flex-col justify-between relative shadow-sm border border-[#EBE5DC]">
            
            {/* SCREEN 1: WELCOME */}
            {step === 1 && (
              <div className="flex-1 flex flex-col justify-between items-center text-center">
                <header className="w-full pt-2">
                  <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-1.5 tracking-tight">نبض الألم</h2>
                  <h1 className="text-[#0F263A] text-2xl sm:text-[28px] font-black leading-tight mb-2 tracking-tight">الألم يُرى ولا يُوصف بالكلمات</h1>
                  <p className="text-[#697A8B] text-sm sm:text-base font-medium">صف ألمك بصرياً ليسهل فهمه</p>
                </header>
                <main className="my-auto py-2">
                  <div className="w-full max-w-[270px] sm:max-w-[290px] mx-auto">
                    <img src={ASSETS.welcome} alt="الألم يُرى" className="w-full h-auto drop-shadow-xs" />
                  </div>
                </main>
                <footer className="w-full pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="w-full h-[58px] sm:h-[62px] rounded-full bg-[#277885] hover:bg-[#1F6773] active:scale-[0.98] text-white font-extrabold text-xl shadow-sm transition-all cursor-pointer"
                  >
                    ابدأ الوصف
                  </button>
                </footer>
              </div>
            )}

            {/* SCREEN 2: LOCATION */}
            {step === 2 && (
              <div className="flex-1 flex flex-col justify-between items-center text-center">
                <header className="w-full pt-2">
                  <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-1.5 tracking-tight">الخطوة ١ من ٦</h2>
                  <h1 className="text-[#0F263A] text-2xl sm:text-[30px] font-black leading-tight mb-2 tracking-tight">أين تشعر بالألم؟</h1>
                  <p className="text-[#697A8B] text-sm sm:text-base font-medium">المس المكان على الجسم</p>
                </header>
                <main className="my-auto py-2 w-full flex flex-col items-center">
                  <div onClick={handleCanvasClick} className="relative w-full max-w-[260px] sm:max-w-[280px] mx-auto cursor-pointer">
                    <img src={ASSETS.clean} alt="المس المكان" className="w-full h-auto drop-shadow-xs pointer-events-none" />
                    <div
                      style={{ left: `${activePoint.x}%`, top: `${activePoint.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-150"
                    >
                      <div className="w-12 h-12 rounded-full bg-[#E64A19]/35 blur-[2px] animate-pulse absolute -translate-x-1/2 -translate-y-1/2" />
                      <div className="w-8 h-8 rounded-full border border-[#E64A19]/60 absolute -translate-x-1/2 -translate-y-1/2" />
                      <div className="w-5 h-5 rounded-full bg-[#E64A19] border border-[#FF7043] flex items-center justify-center shadow-md absolute -translate-x-1/2 -translate-y-1/2">
                        <div className="w-2.5 h-2.5 rounded-full bg-white shadow-xs" />
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex items-center justify-between px-1 mt-3">
                    <div className="bg-[#EFECE7] p-1 rounded-full flex items-center shadow-inner">
                      <button onClick={() => setView('front')} className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${view === 'front' ? 'bg-white text-[#0F263A] shadow-xs' : 'text-[#7A8A99]'}`}>أمام</button>
                      <button onClick={() => setView('back')} className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${view === 'back' ? 'bg-white text-[#0F263A] shadow-xs' : 'text-[#7A8A99]'}`}>خلف</button>
                    </div>
                    <button onClick={() => setActivePoint({ x: 50, y: 44 })} className="min-h-[40px] px-4 py-1.5 rounded-full border-2 border-[#277885] bg-transparent text-[#277885] text-xs sm:text-sm font-black flex items-center gap-1.5 cursor-pointer">⊕ إضافة موضع</button>
                  </div>
                </main>
                <footer className="w-full pt-2 space-y-3">
                  <button onClick={() => setStep(3)} className="w-full h-[58px] sm:h-[62px] rounded-full bg-[#277885] hover:bg-[#1F6773] text-white font-extrabold text-xl shadow-sm transition-all cursor-pointer">متابعة</button>
                  <button onClick={() => setStep(1)} className="w-full h-[58px] sm:h-[62px] rounded-full border-2 border-[#D8D2CA] text-[#277885] font-extrabold text-xl transition-all cursor-pointer">رجوع</button>
                </footer>
              </div>
            )}

            {/* SCREEN 3: RADIATION */}
            {step === 3 && (
              <div className="flex-1 flex flex-col justify-between items-center text-center">
                <header className="w-full pt-2">
                  <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-1.5 tracking-tight">الخطوة ٢ من ٦</h2>
                  <h1 className="text-[#0F263A] text-2xl sm:text-[30px] font-black leading-tight mb-2 tracking-tight">إلى أين يمتد الألم؟</h1>
                  <p className="text-[#697A8B] text-sm sm:text-base font-medium">اسحب من مكان البداية إلى مكان الإمتداد</p>
                </header>
                <main className="my-auto py-2 w-full flex flex-col items-center">
                  <div className="relative w-full max-w-[270px] sm:max-w-[290px] mx-auto">
                    <img src={ASSETS.radiation} alt="مسار امتداد الألم" className="w-full h-auto drop-shadow-xs pointer-events-none" />
                  </div>
                  <div className="w-full flex items-center justify-between px-1 mt-3">
                    <div className="bg-[#EFECE7] p-1 rounded-full flex items-center shadow-inner">
                      <button onClick={() => setView('front')} className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${view === 'front' ? 'bg-white text-[#0F263A] shadow-xs' : 'text-[#7A8A99]'}`}>أمام</button>
                      <button onClick={() => setView('back')} className={`min-h-[36px] px-3.5 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${view === 'back' ? 'bg-white text-[#0F263A] shadow-xs' : 'text-[#7A8A99]'}`}>خلف</button>
                    </div>
                  </div>
                </main>
                <footer className="w-full pt-2 space-y-3">
                  <button onClick={() => setStep(4)} className="w-full h-[58px] sm:h-[62px] rounded-full bg-[#277885] hover:bg-[#1F6773] text-white font-extrabold text-xl shadow-sm transition-all cursor-pointer">متابعة</button>
                  <button onClick={() => setStep(2)} className="w-full h-[58px] sm:h-[62px] rounded-full bg-[#D5E4DF] text-[#277885] font-extrabold text-xl transition-all cursor-pointer">رجوع</button>
                </footer>
              </div>
            )}

            {/* SCREEN 4: INTENSITY */}
            {step === 4 && (
              <div className="flex-1 flex flex-col justify-between items-center text-center">
                <header className="w-full pt-1">
                  <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-3 tracking-tight">الخطوة ٣ من ٦</h2>
                  <div className="w-full max-w-[320px] mx-auto relative flex items-center justify-between px-2 mb-4">
                    <div className="h-[2px] bg-[#E2DBD3] absolute left-3 right-3 top-1/2 -translate-y-1/2 z-0" />
                    <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#277885]" />
                    <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#277885]" />
                    <div className="relative z-10 w-6 h-6 rounded-full border-2 border-[#277885] bg-[#FAF7F2] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#277885]" />
                    </div>
                    <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#D8D2CA]" />
                    <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#D8D2CA]" />
                    <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-[#D8D2CA]" />
                  </div>
                  <h1 className="text-[#0F263A] text-2xl sm:text-[30px] font-black leading-tight mb-1.5 tracking-tight">ما شدة الألم؟</h1>
                  <p className="text-[#697A8B] text-sm sm:text-base font-medium">اختر اللون الأقرب إلى إحساسك</p>
                </header>
                <main className="my-auto py-2 w-full flex flex-col items-center">
                  <div className="relative w-full max-w-[210px] sm:max-w-[235px] mx-auto">
                    <img src={ASSETS.intensity} alt="شدة الألم" className="w-full h-auto drop-shadow-xs pointer-events-none" />
                    <div className="absolute pointer-events-none transition-all duration-300" style={{ left: '64%', top: '28%', transform: 'translate(-50%, -50%)' }}>
                      <div className="rounded-full blur-md opacity-75 transition-all duration-300" style={{ width: `${24 + selectedLevel * 3}px`, height: `${24 + selectedLevel * 3}px`, backgroundColor: activeSwatch.hex, boxShadow: `0 0 ${16 + selectedLevel * 2}px ${activeSwatch.hex}` }} />
                    </div>
                  </div>
                </main>
                <div className="w-full space-y-3 pb-1">
                  <div className="w-full bg-white rounded-[26px] p-5 shadow-xs border border-[#EDE8E0]">
                    <div className="flex items-center justify-between text-sm font-bold mb-3 px-1">
                      <span className="text-[#8D9AA6]">خفيف</span>
                      <div className="flex-1 mx-3 h-[1px] bg-[#E8E2D9]" />
                      <span className="text-[#D3524B]">شديد</span>
                    </div>
                    <div className="flex items-center justify-between px-1 pt-1">
                      {SWATCHES.map((swatch) => (
                        <button
                          key={swatch.level}
                          onClick={() => setSelectedLevel(swatch.level)}
                          className={`transition-all duration-150 cursor-pointer flex items-center justify-center rounded-full ${swatch.level === selectedLevel ? 'w-11 h-11 p-[3px] border-2 border-[#277885] bg-white shadow-sm scale-110' : 'w-10 h-10 hover:scale-105'}`}
                        >
                          <div className="w-full h-full rounded-full" style={{ backgroundColor: swatch.hex }} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <footer className="w-full flex items-center gap-3 pt-1">
                    <button onClick={() => setStep(5)} className="flex-1 h-[56px] sm:h-[60px] rounded-full bg-[#277885] hover:bg-[#1F6773] text-white font-extrabold text-lg sm:text-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                      <span>متابعة</span>
                      <span>‹</span>
                    </button>
                    <button onClick={() => setStep(3)} className="flex-1 h-[56px] sm:h-[60px] rounded-full bg-[#F4EAE1] hover:bg-[#EAE0D7] text-[#0F263A] font-extrabold text-lg sm:text-xl transition-all flex items-center justify-center gap-2 cursor-pointer border-0">
                      <span>›</span>
                      <span>رجوع</span>
                    </button>
                  </footer>
                </div>
              </div>
            )}

            {/* SCREEN 5: NATURE (Image 5) */}
            {step === 5 && (
              <div className="flex-1 flex flex-col justify-between items-center text-center">
                <div className="w-full bg-[#E5EEEB] h-1.5 rounded-full overflow-hidden mb-3">
                  <div className="bg-[#277885] h-full rounded-full" style={{ width: '66%' }} />
                </div>
                <header className="w-full text-center mb-2">
                  <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-1.5 tracking-tight">الخطوة ٤ من ٦</h2>
                  <h1 className="text-[#0F263A] text-2xl sm:text-[30px] font-black leading-tight mb-1.5 tracking-tight">كيف يبدو الألم؟</h1>
                  <p className="text-[#697A8B] text-sm sm:text-base font-medium">اسحب الرمز إلى مكان الألم ✥</p>
                </header>
                <main className="my-auto py-1 w-full flex items-center justify-between gap-3">
                  <div className="relative w-[42%] max-w-[170px] flex items-center justify-center">
                    <img src={ASSETS.scrubs} alt="طبيعة الألم" className="w-full h-auto object-contain pointer-events-none" />
                    <div className="absolute top-[26%] right-[-10px] flex items-center pointer-events-none">
                      <div className="w-4 h-4 rounded-full bg-[#E64A19] border-2 border-white shadow-sm -ml-2 z-10" />
                      <div className="w-12 h-12 rounded-full bg-[#E2F1EE] border border-[#BCE0DA] shadow-md flex items-center justify-center z-20 text-xl">
                        {SENSATIONS.find(s => s.id === selectedSensation)?.icon || '🔥'}
                      </div>
                    </div>
                  </div>
                  <div className="w-[56%] grid grid-cols-2 gap-2.5">
                    {SENSATIONS.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSensation(s.id)}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl transition-all cursor-pointer ${
                          selectedSensation === s.id
                            ? 'bg-[#E7F4F2] border-2 border-[#277885] shadow-sm scale-[1.02]'
                            : 'bg-white border border-[#EAE3D9] hover:bg-[#FAFAF8]'
                        }`}
                      >
                        <span className="text-2xl mb-1">{s.icon}</span>
                        <span className="text-base sm:text-lg font-black text-[#0F263A]">{s.name}</span>
                      </button>
                    ))}
                  </div>
                </main>
                <div className="w-full bg-[#E9F5F3] border border-[#CFE7E3] rounded-2xl p-3 my-2 flex items-center justify-between text-xs sm:text-sm font-bold text-[#0F263A]">
                  <span>✋ اسحب الأيقونة إلى مكان الألم ثم اضغط على التالي</span>
                  <span className="w-7 h-7 rounded-lg bg-[#277885] text-white flex items-center justify-center">←</span>
                </div>
                <footer className="w-full space-y-2 pt-1 pb-1">
                  <button onClick={() => setStep(6)} className="w-full h-[54px] rounded-2xl bg-[#0F263A] hover:bg-[#1A3850] text-white font-extrabold text-lg flex items-center justify-center gap-2 cursor-pointer">
                    <span>متابعة</span>
                    <span>←</span>
                  </button>
                  <button onClick={() => setStep(4)} className="w-full h-[52px] rounded-2xl bg-[#D8EAE5] text-[#0F263A] font-extrabold text-lg flex items-center justify-center gap-2 cursor-pointer border-0">
                    <span>→</span>
                    <span>رجوع</span>
                  </button>
                </footer>
              </div>
            )}

            {/* SCREEN 6: TIME (Image 6) */}
            {step === 6 && (
              <div className="flex-1 flex flex-col justify-between items-center text-center">
                <header className="w-full relative pt-1 text-center">
                  <div className="absolute right-0 top-0 w-9 h-9 rounded-full bg-[#E5F2F0] flex items-center justify-center text-[#277885]">🌿</div>
                  <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-1 tracking-tight">الخطوة ٥ من ٦</h2>
                  <h1 className="text-[#0F263A] text-2xl sm:text-[30px] font-black leading-tight mb-1 tracking-tight">متى يظهر الألم؟</h1>
                  <p className="text-[#697A8B] text-sm sm:text-base font-medium">اسحب العلامات لتحديد الوقت</p>
                </header>
                <main className="my-auto py-2 w-full">
                  <div className="w-full bg-white rounded-[32px] p-5 shadow-xs border border-[#ECE5DC] space-y-4">
                    <div className="flex justify-end">
                      <div className="bg-[#EFECE7] p-1 rounded-full flex gap-1 shadow-inner">
                        <span className="px-3 py-1.5 rounded-full text-xs font-black bg-[#E26153] text-white">📅 بداية الألم</span>
                        <span className="px-3 py-1.5 rounded-full text-xs font-black text-[#697A8B]">🕒 يتكرر</span>
                      </div>
                    </div>
                    <div className="pt-4 pb-1">
                      <div className="relative h-8 w-full mb-1">
                        <div className="absolute right-[20%] -top-2 flex flex-col items-center">
                          <span className="bg-[#E26153] text-white text-[10px] font-bold px-2 py-0.5 rounded-md">📅 بداية الألم</span>
                        </div>
                        <div className="absolute right-[70%] -top-2 flex flex-col items-center">
                          <span className="bg-[#FAF0ED] text-[#E26153] border border-[#F3C4BC] text-[10px] font-bold px-2 py-0.5 rounded-md">🕒 يتكرر</span>
                        </div>
                      </div>
                      <div className="relative w-full h-3 bg-[#E5EEEB] rounded-full flex items-center px-1">
                        <div className="absolute inset-x-2 h-1 bg-[#277885] rounded-full" />
                      </div>
                      <div className="flex justify-between text-xs font-black text-[#0F263A] pt-2 px-1">
                        <span>٠٦</span>
                        <span>12</span>
                        <span>١٨</span>
                        <span>24</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-[#8D9AA6] pt-1 px-1">
                        <span>صباحاً</span>
                        <span>ظهراً</span>
                        <span>مساءً</span>
                        <span>ليلاً</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button onClick={() => setFrequency('multiple')} className={`flex-1 py-3 rounded-2xl text-sm font-extrabold cursor-pointer ${frequency === 'multiple' ? 'bg-[#EF6B5A] text-white' : 'bg-[#F2ECE4] text-[#0F263A]'}`}>🕒 عدة مرات</button>
                      <button onClick={() => setFrequency('once')} className={`flex-1 py-3 rounded-2xl text-sm font-extrabold cursor-pointer ${frequency === 'once' ? 'bg-[#EF6B5A] text-white' : 'bg-[#E5EEF1] text-[#0F263A]'}`}>مرة واحدة</button>
                    </div>
                    <div className="flex justify-start pt-1">
                      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#FAF7F2] border border-[#E8E2D9]">
                        <img src={ASSETS.miniAvatar} alt="مكان الألم" className="w-14 h-14 object-contain" />
                        <span className="bg-[#EF6B5A] text-white text-[11px] font-black px-2 py-1 rounded-full">مكان الألم</span>
                      </div>
                    </div>
                  </div>
                </main>
                <footer className="w-full space-y-2.5 pt-2 pb-1">
                  <button onClick={() => setStep(7)} className="w-full h-[56px] rounded-full bg-[#277885] hover:bg-[#1F6773] text-white font-extrabold text-xl shadow-sm transition-all cursor-pointer">متابعة</button>
                  <button onClick={() => setStep(5)} className="w-full h-[56px] rounded-full bg-[#D5E4DF] text-[#277885] font-extrabold text-xl transition-all cursor-pointer">رجوع</button>
                </footer>
              </div>
            )}

            {/* SCREEN 7: MOVEMENTS (Image 7) */}
            {step === 7 && (
              <div className="flex-1 flex flex-col justify-between items-center text-center">
                <header className="w-full relative pt-1 text-center">
                  <div className="w-full flex items-center justify-between mb-2">
                    <button onClick={() => setStep(6)} className="w-9 h-9 rounded-full bg-white border border-[#E8E2D9] flex items-center justify-center text-[#0F263A] cursor-pointer">←</button>
                    <div className="flex items-center gap-1.5 text-right">
                      <span className="text-xs font-black text-[#0F263A] leading-none">عيادة<br />الصحة</span>
                      <div className="w-8 h-8 rounded-full bg-[#E5F2F0] flex items-center justify-center text-[#277885]">🌿</div>
                    </div>
                  </div>
                  <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-1 tracking-tight">الخطوة ٦ من ٦</h2>
                  <h1 className="text-[#0F263A] text-2xl sm:text-[28px] font-black leading-tight mb-1 tracking-tight">ما الحركات التي تصعب عليك؟</h1>
                  <p className="text-[#697A8B] text-sm sm:text-base font-medium">اختر الحركة المتأثرة</p>
                </header>
                <main className="my-auto py-2 space-y-2.5 w-full">
                  {MOVEMENTS.map((m) => {
                    const isSelected = m.id === selectedMovement;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedMovement(m.id)}
                        className={`w-full p-3 rounded-2xl flex items-center justify-between transition-all cursor-pointer shadow-xs ${
                          isSelected ? 'bg-[#E9F5F3] border-2 border-[#277885]' : 'bg-white border border-[#ECE5DC]'
                        }`}
                      >
                        <div className="w-20 h-16 flex items-center justify-center">
                          <img src={m.img} alt={m.name} className="max-h-full max-w-full object-contain pointer-events-none" />
                        </div>
                        <div className="flex-1 text-center px-3">
                          <span className="text-lg font-black text-[#0F263A]">{m.name}</span>
                        </div>
                        <div className="w-8 flex items-center justify-center">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-[#277885] bg-[#277885] text-white' : 'border-[#B8C5CA] bg-white'}`}>
                            {isSelected && '✓'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </main>
                <footer className="w-full space-y-2 pt-2 pb-1 text-center">
                  <button onClick={() => setStep(8)} className="w-full h-[56px] rounded-full bg-[#277885] hover:bg-[#1F6773] text-white font-extrabold text-xl shadow-sm transition-all cursor-pointer">
                    عرض التقرير ›
                  </button>
                  <button onClick={() => setStep(6)} className="text-sm font-bold text-[#697A8B] cursor-pointer">‹ رجوع</button>
                </footer>
              </div>
            )}

            {/* SCREEN 8: FINAL REPORT (Image 8) */}
            {step === 8 && (
              <div className="flex-1 flex flex-col justify-between items-center text-center">
                <header className="w-full relative pt-1">
                  <div className="w-full flex items-center justify-between mb-2">
                    <div className="text-right">
                      <h1 className="text-[#0F263A] text-2xl sm:text-[28px] font-black leading-tight tracking-tight">ملخص وصف الألم</h1>
                      <p className="text-[#697A8B] text-xs sm:text-sm font-medium mt-0.5">راجع المعلومات قبل مشاركتها</p>
                    </div>
                    <div className="flex items-center gap-1.5 text-right">
                      <span className="text-xs font-black text-[#0F263A] leading-tight">عيادة<br />الشفاء</span>
                      <div className="w-9 h-9 rounded-full bg-[#E5F2F0] flex items-center justify-center border border-[#CFE7E3] text-[#277885]">🌿</div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex flex-col items-center">
                      <div className="w-14 h-14 rounded-full p-1 bg-white border border-[#E8E2D9] shadow-2xs flex items-center justify-center">
                        <img src={ASSETS.doctor} alt="الطبيب" className="w-full h-full object-contain" />
                      </div>
                      <button onClick={() => setStep(2)} className="mt-1 text-xs font-black text-[#277885] cursor-pointer">تعديل ✎</button>
                    </div>
                    <div className="relative w-36 sm:w-40 flex items-center justify-center">
                      <img src={ASSETS.report} alt="ملخص التقرير" className="w-full h-auto object-contain pointer-events-none" />
                    </div>
                  </div>
                </header>
                <main className="w-full my-auto py-2 space-y-2">
                  {[
                    { label: 'المكان', val: 'الكتف الأيسر', icon: '📍', bg: 'bg-[#E26153]', stepTo: 2 },
                    { label: 'الأمتداد', val: 'إلى الركبة', icon: '⬇', bg: 'bg-[#277885]', stepTo: 3 },
                    { label: 'الشدة', val: 'شديدة (8/10)', icon: '⏱', bg: 'bg-[#0F263A]', stepTo: 4 },
                    { label: 'الطبيعة', val: 'حرقان', icon: '🔥', bg: 'bg-[#E26153]', stepTo: 5 },
                    { label: 'الوقت', val: 'صباحاً ويتكرر', icon: '🕒', bg: 'bg-[#277885]', stepTo: 6 },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => setStep(item.stepTo)}
                      className="w-full bg-white rounded-2xl p-3 px-4 shadow-2xs border border-[#ECE5DC] flex items-center justify-between cursor-pointer hover:bg-[#FAFAF8]"
                    >
                      <div className="text-[#8D9AA6]">‹</div>
                      <div className="flex-1 text-right pr-3 font-extrabold text-sm sm:text-base text-[#0F263A]">
                        <span>{item.label}</span>
                        <span className="text-[#8D9AA6] mx-1.5">—</span>
                        <span>{item.val}</span>
                      </div>
                      <div className={`w-9 h-9 rounded-full ${item.bg} text-white flex items-center justify-center text-sm shadow-xs`}>
                        {item.icon}
                      </div>
                    </div>
                  ))}
                </main>
                <div className="w-full flex items-center justify-center gap-1.5 text-xs font-bold text-[#8D9AA6] py-1">
                  <span>لن تتم المشاركة دون موافقتك 🔒</span>
                </div>
                {isSent && (
                  <div className="w-full p-2 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-700 text-xs font-black text-center mb-1">
                    ✓ تم إرسال التقرير الطبي للطبيب بنجاح! كود العيادة: PV-4981
                  </div>
                )}
                <footer className="w-full space-y-2 pt-1 pb-1">
                  <button
                    onClick={() => { setIsSent(true); setTimeout(() => setIsSent(false), 3000); }}
                    className="w-full h-[54px] rounded-2xl bg-gradient-to-r from-[#0F263A] to-[#277885] hover:opacity-95 text-white font-extrabold text-lg flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <span>إرسال للطبيب</span>
                    <span>✈</span>
                  </button>
                  <button
                    onClick={() => alert('تم حفظ التقرير الطبي كملف مرجعي.')}
                    className="w-full h-[52px] rounded-2xl bg-white border border-[#0F263A]/80 text-[#0F263A] font-extrabold text-lg flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>حفظ التقرير</span>
                    <span>🔖</span>
                  </button>
                </footer>
              </div>
            )}

          </div>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>'''

html_content = (
    template
    .replace('__B64_WELCOME__', b64_map['welcome'])
    .replace('__B64_CLEAN__', b64_map['clean'])
    .replace('__B64_RADIATION__', b64_map['radiation'])
    .replace('__B64_INTENSITY__', b64_map['intensity'])
    .replace('__B64_SCRUBS__', b64_map['scrubs'])
    .replace('__B64_MINI_AVATAR__', b64_map['mini_avatar'])
    .replace('__B64_BENDING__', b64_map['bending'])
    .replace('__B64_ARM__', b64_map['arm'])
    .replace('__B64_WALKING__', b64_map['walking'])
    .replace('__B64_STANDING__', b64_map['standing'])
    .replace('__B64_REPORT__', b64_map['report'])
    .replace('__B64_DOCTOR__', b64_map['doctor'])
)

with open(r'c:\Users\MO\Desktop\defi_train\demo.html', 'w', encoding='utf-8') as f:
    f.write(html_content)

print('demo.html successfully generated with all 8 screens!')
