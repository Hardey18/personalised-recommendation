/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-syne)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
        mono: ['var(--font-dm-mono)', 'monospace'],
      },
      colors: {
        cream: {
          50: '#FDFCF8',
          100: '#FAF8F2',
          200: '#F5F0E8',
        },
        slate: {
          950: '#0A0F1E',
        },
        brand: {
          50:  '#EEF5FF',
          100: '#D9E8FF',
          200: '#BBCFFF',
          300: '#93AEFF',
          400: '#6B8EF5',
          500: '#4B6EE8',
          600: '#3451D1',
          700: '#2A3FA8',
          800: '#243487',
          900: '#1E2C6B',
          950: '#141B42',
        },
        accent: {
          50: '#FFF7ED',
          100: '#FFEDD5',
          200: '#FED7AA',
          300: '#FDBA74',
          400: '#FB923C',
          500: '#F97316',
          600: '#EA6C0A',
        },
        success: '#16A34A',
        error: '#DC2626',
        warning: '#D97706',
      },
      boxShadow: {
        'soft': '0 2px 8px 0 rgba(0,0,0,0.06)',
        'card': '0 4px 24px 0 rgba(75,110,232,0.08)',
        'elevated': '0 8px 40px 0 rgba(75,110,232,0.12)',
        'glow': '0 0 40px 0 rgba(75,110,232,0.2)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
  },
  plugins: [],
};