// frontend/src/components/common/TouchButton.tsx
import React from 'react';

export interface TouchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'action' | 'success';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const TouchButton: React.FC<TouchButtonProps> = ({
  variant = 'primary',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-extrabold rounded-2xl transition-all duration-200 select-none focus:outline-none focus:ring-4 focus:ring-red-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 touch-manipulation cursor-pointer';

  const variants = {
    // 60px ergonomic flagship action button
    action:
      'w-full min-h-[60px] text-base sm:text-lg bg-gradient-to-r from-red-600 via-rose-600 to-red-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/35 hover:-translate-y-0.5 active:translate-y-0 active:bg-red-800',
    primary:
      'min-h-[52px] px-6 text-sm sm:text-base bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-md shadow-red-500/20 hover:shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 active:translate-y-0',
    secondary:
      'min-h-[48px] px-5 text-sm sm:text-base bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-200/80',
    outline:
      'min-h-[48px] px-5 text-sm sm:text-base border-2 border-slate-200 hover:border-slate-300 text-slate-700 bg-white hover:bg-slate-50 active:bg-slate-100 shadow-xs',
    ghost:
      'min-h-[48px] px-4 text-xs sm:text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100 active:bg-slate-200',
    success:
      'min-h-[52px] px-6 text-sm sm:text-base bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
          <span>...</span>
        </span>
      ) : (
        <span className="inline-flex items-center justify-center gap-2.5 w-full">
          {icon && <span className="flex-shrink-0 transition-transform group-hover:scale-110">{icon}</span>}
          <span>{children}</span>
        </span>
      )}
    </button>
  );
};
