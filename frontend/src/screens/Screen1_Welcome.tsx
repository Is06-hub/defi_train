// frontend/src/screens/Screen1_Welcome.tsx
import React from 'react';
import { usePainSessionStore } from '../store/usePainSessionStore';
import avatarWelcome from '../assets/avatar_welcome.png';

export const Screen1_Welcome: React.FC = () => {
  const { startSession, isSubmitting, errorMessage, clearError } = usePainSessionStore();

  const handleStart = async () => {
    await startSession();
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F263A] flex flex-col justify-between items-center px-6 py-8 sm:py-10 max-w-md mx-auto select-none font-sans" dir="rtl">
      {/* Top Header */}
      <header className="w-full text-center pt-2 sm:pt-4">
        {/* Subtitle / Category */}
        <h2 className="text-[#0F263A] text-base sm:text-lg font-bold mb-1.5 tracking-tight">
          نبض الألم
        </h2>

        {/* Main Title */}
        <h1 className="text-[#0F263A] text-2xl sm:text-[28px] font-black leading-tight mb-2 tracking-tight">
          الألم يُرى ولا يُوصف بالكلمات
        </h1>

        {/* Description */}
        <p className="text-[#697A8B] text-sm sm:text-base font-medium">
          صف ألمك بصرياً ليسهل فهمه
        </p>
      </header>

      {/* Center Avatar Illustration with 4 Glowing Pain Points */}
      <main className="flex-1 w-full flex items-center justify-center my-auto py-2 relative">
        <div className="relative w-full max-w-[280px] sm:max-w-[310px] flex items-center justify-center">
          <img
            src={avatarWelcome}
            alt="شخصية وصف الألم"
            className="w-full h-auto object-contain drop-shadow-xs pointer-events-none"
            draggable={false}
          />
        </div>
      </main>

      {/* Bottom CTA Button */}
      <footer className="w-full pt-2 pb-2">
        {errorMessage && (
          <div
            className="mb-3 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-xs font-bold flex items-center justify-between"
            role="alert"
          >
            <span>{errorMessage}</span>
            <button
              onClick={clearError}
              className="text-red-500 hover:text-red-800 p-1 font-black cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        <button
          type="button"
          onClick={handleStart}
          disabled={isSubmitting}
          className="w-full h-[58px] sm:h-[62px] rounded-full bg-[#277885] hover:bg-[#1F6773] active:scale-[0.98] text-white font-extrabold text-xl shadow-sm transition-all duration-150 flex items-center justify-center cursor-pointer disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
              <span>جارِ البدء...</span>
            </span>
          ) : (
            'ابدأ الوصف'
          )}
        </button>
      </footer>
    </div>
  );
};

export default Screen1_Welcome;
