/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Primary red — pulled from the TryLinqr logo
        brand: {
          50: '#fef2f3',
          100: '#fce0e2',
          200: '#f9c5c9',
          300: '#f499aa',
          400: '#ec5b66',
          500: '#e11d2e',
          600: '#c8132a',
          700: '#a51025',
          800: '#891124',
          900: '#741322',
        },
        // Secondary royal blue
        royal: {
          50: '#eef3ff',
          100: '#dce6ff',
          200: '#c0d2ff',
          300: '#97b3ff',
          400: '#6c8bfb',
          500: '#3b5bf0',
          600: '#2540d6',
          700: '#1e32ad',
          800: '#1d2e8a',
          900: '#1d2c6e',
        },
        // Deep navy surfaces
        ink: {
          DEFAULT: '#070b16',
          soft: '#0e1426',
          card: '#121a30',
          line: '#1f2942',
          muted: '#8a93ac',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 20px 60px -15px rgba(225,29,46,0.45)',
        'glow-blue': '0 20px 60px -15px rgba(59,91,240,0.45)',
        soft: '0 8px 30px rgba(0,0,0,0.35)',
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        'float-slow': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-14px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
