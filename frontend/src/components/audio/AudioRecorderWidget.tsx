// frontend/src/components/audio/AudioRecorderWidget.tsx
import React, { useState, useEffect, useRef } from 'react';
import { usePainSessionStore } from '../../store/usePainSessionStore';
import { Mic, Square, Trash2, Play, Pause, Volume2, CheckCircle2, RotateCcw } from 'lucide-react';

export const AudioRecorderWidget: React.FC = () => {
  const { language, audioMemo, recordAudioMemo, deleteAudioMemo, isSubmitting } = usePainSessionStore();
  const isAr = language === 'ar';

  const [isRecording, setIsRecording] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<any>(null);

  const MAX_SECONDS = 45;

  // Countdown / Elapsed timer logic
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setSecondsElapsed((prev) => {
          if (prev >= MAX_SECONDS - 1) {
            handleStopRecording();
            return MAX_SECONDS;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setSecondsElapsed(0);
    setIsRecording(true);
  };

  const handleStopRecording = async () => {
    setIsRecording(false);
    const finalDuration = secondsElapsed || 1;
    await recordAudioMemo(finalDuration);
  };

  const handleDeleteAudio = async () => {
    await deleteAudioMemo();
    setSecondsElapsed(0);
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), (audioMemo.durationSeconds || 5) * 1000);
    }
  };

  const remainingSeconds = MAX_SECONDS - secondsElapsed;

  return (
    <div className="w-full bg-white border border-slate-200/90 rounded-3xl p-4 sm:p-5 shadow-2xs space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <Mic className="w-4 h-4" />
          </div>
          <h3 className="text-xs sm:text-sm font-black text-slate-900">
            {isAr ? 'ملاحظة صوتية إرغونومية (اختيارية):' : 'Mémo vocal ergonomique (optionnel):'}
          </h3>
        </div>
        <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
          {isAr ? 'أقصى مدة: 45 ثانية' : 'Max 45 secondes'}
        </span>
      </div>

      {/* State 1: Idle (Ready to record) */}
      {!audioMemo.hasAudio && !isRecording && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-dashed border-slate-300">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleStartRecording}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700 active:scale-95 text-white flex items-center justify-center shadow-md shadow-red-500/25 transition-all cursor-pointer flex-shrink-0"
              title={isAr ? 'بدء التسجيل الصوتي' : 'Enregistrer'}
            >
              <Mic className="w-6 h-6 animate-pulse" />
            </button>
            <div className="text-right rtl:text-right ltr:text-left">
              <span className="text-xs sm:text-sm font-black text-slate-900 block">
                {isAr ? 'تعبير صوتي حر بدون كتابة' : 'Expression vocale libre'}
              </span>
              <span className="text-[11px] text-slate-500 font-medium block mt-0.5">
                {isAr
                  ? 'إذا أردت إضافة ملاحظة خاصة لطبيبك بصوتك في 45 ثانية'
                  : 'Ajoutez une précision à l’attention du médecin (sans saisie)'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleStartRecording}
            className="min-h-[40px] px-4 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-black text-slate-700 transition-all active:scale-95 shadow-2xs cursor-pointer"
          >
            {isAr ? 'تسجيل الآن' : 'Enregistrer'}
          </button>
        </div>
      )}

      {/* State 2: Active Recording */}
      {isRecording && (
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-rose-50/70 border-2 border-rose-300 space-y-3">
          {/* Animated Waveform Bars */}
          <div className="flex items-center gap-1.5 h-10">
            <span className="w-1.5 h-4 bg-rose-500 rounded-full animate-bounce [animation-delay:0ms]"></span>
            <span className="w-1.5 h-8 bg-rose-600 rounded-full animate-bounce [animation-delay:150ms]"></span>
            <span className="w-1.5 h-5 bg-rose-500 rounded-full animate-bounce [animation-delay:300ms]"></span>
            <span className="w-1.5 h-9 bg-rose-700 rounded-full animate-bounce [animation-delay:450ms]"></span>
            <span className="w-1.5 h-6 bg-rose-500 rounded-full animate-bounce [animation-delay:200ms]"></span>
            <span className="w-1.5 h-4 bg-rose-400 rounded-full animate-bounce [animation-delay:100ms]"></span>
            <span className="w-1.5 h-7 bg-rose-600 rounded-full animate-bounce [animation-delay:350ms]"></span>
          </div>

          <div className="text-center">
            <span className="text-2xl font-black text-rose-700 font-mono tracking-wider block">
              00:{remainingSeconds.toString().padStart(2, '0')}
            </span>
            <span className="text-xs font-bold text-rose-600">
              {isAr ? 'جارِ التسجيل... (المس الزر للإيقاف والحفظ)' : 'Enregistrement en cours...'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleStopRecording}
            className="min-h-[48px] px-6 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 active:scale-95 shadow-md shadow-rose-500/25 transition-all cursor-pointer"
          >
            <Square className="w-4 h-4 fill-white" />
            <span>{isAr ? 'إيقاف وحفظ الملاحظة' : 'Arrêter et enregistrer'}</span>
          </button>
        </div>
      )}

      {/* State 3: Recorded (Audio Ready) */}
      {audioMemo.hasAudio && !isRecording && (
        <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white flex items-center justify-center shadow-md shadow-emerald-500/20 transition-all cursor-pointer flex-shrink-0"
              title={isPlaying ? (isAr ? 'إيقاف' : 'Pause') : (isAr ? 'تشغيل' : 'Écouter')}
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
            </button>
            <div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-xs sm:text-sm font-black text-emerald-950">
                  {isAr ? 'الملاحظة الصوتية جاهزة' : 'Mémo vocal enregistré'}
                </span>
              </div>
              <span className="text-xs font-bold text-slate-500 font-mono">
                {audioMemo.durationSeconds || 5}s / 45s
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDeleteAudio}
            disabled={isSubmitting}
            className="min-h-[40px] px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-black flex items-center gap-1.5 active:scale-95 transition-all cursor-pointer"
            title={isAr ? 'حذف وإعادة التسجيل' : 'Supprimer'}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isAr ? 'حذف' : 'Effacer'}</span>
          </button>
        </div>
      )}
    </div>
  );
};
