/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Crimson Depth — primary brand
        brand: {
          50: '#fdf3f4',
          100: '#fbe3e6',
          200: '#f5c3c8',
          300: '#ec98a0',
          400: '#dd6571',
          500: '#a01524',
          600: '#8a0c1b',
          700: '#710014', // primary
          800: '#5a000f',
          900: '#42000b',
        },
        // Warm Sand — premium accent
        sand: {
          50: '#faf6f1',
          100: '#f1e9dd',
          200: '#e4d2bd',
          300: '#d4b89a',
          400: '#c5a380',
          500: '#b38f6f', // primary
          600: '#9a795d',
          700: '#7c624c',
          800: '#5e4a3a',
          900: '#403328',
        },
        // Obsidian — dark cinematic surfaces (footer, CTA, banners)
        obsidian: {
          DEFAULT: '#161616',
          soft: '#1f1f22',
          line: 'rgba(255,255,255,0.08)',
        },
        // Pearl — light page surfaces (ink kept as alias to avoid breakage)
        pearl: '#f2f1ed',
        ink: {
          DEFAULT: '#f2f1ed',          // page background utility (`bg-ink`)
          soft: '#ffffff',             // raised surfaces
          card: '#ffffff',             // cards
          line: 'rgba(22,22,22,0.08)', // hairline border
          muted: '#6b6b73',            // muted text
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Plus Jakarta Sans', 'ui-sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'ui-serif', 'serif'],
      },
      boxShadow: {
        glow: '0 22px 50px -22px rgba(113,0,20,0.45)',
        'glow-soft': '0 16px 40px -18px rgba(113,0,20,0.28)',
        soft: '0 12px 32px rgba(22,22,22,0.10)',
        card: '0 10px 30px -14px rgba(22,22,22,0.18)',
        elevated: '0 30px 60px -24px rgba(22,22,22,0.25)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #710014 0%, #a01524 100%)',
        'sand-gradient': 'linear-gradient(135deg, #b38f6f 0%, #d4b89a 100%)',
        'radial-spot':
          'radial-gradient(60% 50% at 50% 0%, rgba(113,0,20,0.10) 0%, transparent 70%)',
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'float-y': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        pulseDot: {
          '0%,100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.6)', opacity: 0.4 },
        },
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        'float-y': 'float-y 6s ease-in-out infinite',
        'pulse-dot': 'pulseDot 1.6s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
