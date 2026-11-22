/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        pain: {
          light: '#FDE8E8',
          mild: '#FFAA00',
          orange: '#FF5400',
          crimson: '#E63946',
          dark: '#7A0000'
        },
        clinical: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          500: '#64748B',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A'
        }
      },
      minHeight: {
        touch: '48px',
        action: '60px'
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(230, 57, 70, 0.25)',
        'glow-lg': '0 0 25px -2px rgba(230, 57, 70, 0.35)',
        'glow-amber': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-emerald': '0 0 20px -3px rgba(16, 185, 129, 0.35)'
      }
    }
  },
  plugins: []
};
