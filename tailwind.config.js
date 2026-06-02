/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        /* ──────────────────────────────────────────────────────────────
         * Pantone 6-pastel system (TryLinqr 2026)
         * – Mellow Yellow 12-0711 TCX  →  mellow.400 (#E9D88A)
         * – Bleached Apricot 12-0917  →  apricot.300 / sand.300 (#F8C49C)
         * – Rose Shadow 13-3207       →  rose.300 / brand.300 (#EFB3C7)
         * – Winsome Orchid 14-3206    →  orchid.300 (#D7A8CB)
         * – Baby Blue 13-4308         →  baby.300 (#A6C5DC)
         * – White Jade 12-0315        →  jade.300 (#C9DDB1)
         * Buttons / strong text use the deeper 700–800 step of each scale.
         * ────────────────────────────────────────────────────────────── */

        // brand → Rose Shadow family (primary CTAs, links, accents)
        brand: {
          50:  '#fdf5f9',
          100: '#fae6f0',
          200: '#f3ccde',
          300: '#efb3c7',   // Rose Shadow
          400: '#e490b0',
          500: '#d2719a',
          600: '#b85882',
          700: '#944268',   // primary
          800: '#71304f',
          900: '#4f213a',
        },

        // sand → Bleached Apricot family (warm secondary)
        sand: {
          50:  '#fef6ee',
          100: '#fdebd8',
          200: '#fbd7b5',
          300: '#f8c49c',   // Bleached Apricot
          400: '#f2a877',
          500: '#e68e58',   // primary
          600: '#c6743f',
          700: '#9d5a2f',
          800: '#743f22',
          900: '#4f2a17',
        },

        // Mellow Yellow
        mellow: {
          50:  '#fefcec',
          100: '#fcf6cd',
          200: '#f8ec9f',
          300: '#f2de6f',
          400: '#e9d88a',   // Mellow Yellow base
          500: '#dcc75a',
          600: '#c5ac3d',
          700: '#9e862c',
          800: '#765f1f',
          900: '#4d3d14',
        },

        // Bleached Apricot (alias of sand)
        apricot: {
          50:  '#fef6ee',
          100: '#fdebd8',
          200: '#fbd7b5',
          300: '#f8c49c',
          400: '#f2a877',
          500: '#e68e58',
          600: '#c6743f',
          700: '#9d5a2f',
          800: '#743f22',
          900: '#4f2a17',
        },

        // Rose Shadow (alias of brand)
        rose: {
          50:  '#fdf5f9',
          100: '#fae6f0',
          200: '#f3ccde',
          300: '#efb3c7',
          400: '#e490b0',
          500: '#d2719a',
          600: '#b85882',
          700: '#944268',
          800: '#71304f',
          900: '#4f213a',
        },

        // Winsome Orchid
        orchid: {
          50:  '#fbf4fa',
          100: '#f5e3f1',
          200: '#ebc9e3',
          300: '#dcafd2',
          400: '#d7a8cb',   // Winsome Orchid base
          500: '#bd7faf',
          600: '#9f628f',
          700: '#7d4d71',
          800: '#5e3854',
          900: '#3f2538',
        },

        // Baby Blue
        baby: {
          50:  '#f2f7fb',
          100: '#dfeaf3',
          200: '#c6d8e8',
          300: '#a6c5dc',   // Baby Blue base
          400: '#84afcb',
          500: '#5e94b5',
          600: '#437a9b',
          700: '#325f7b',
          800: '#25455b',
          900: '#182e3d',
        },

        // White Jade
        jade: {
          50:  '#f5faee',
          100: '#e5f0d5',
          200: '#d2e5ba',
          300: '#c9ddb1',   // White Jade base
          400: '#adc988',
          500: '#8fb263',
          600: '#739645',
          700: '#587534',
          800: '#3f5524',
          900: '#283718',
        },

        // Soft dark surface for footer / CTA banners — plum-charcoal,
        // softer than pure black so it ties in with the pastels.
        obsidian: {
          DEFAULT: '#2a2236',
          soft: '#352c45',
          line: 'rgba(255,255,255,0.08)',
        },

        // Pearl / cream page background
        pearl: '#fbf7f2',
        ink: {
          DEFAULT: '#fbf7f2',
          soft: '#ffffff',
          card: '#ffffff',
          line: 'rgba(42,34,54,0.10)',
          muted: '#6b6478',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Plus Jakarta Sans', 'ui-sans-serif'],
        serif: ['var(--font-serif)', 'Playfair Display', 'ui-serif', 'serif'],
      },
      boxShadow: {
        // soft rose-mauve glow on primary buttons / featured cards
        glow:        '0 22px 50px -22px rgba(148,66,104,0.45)',
        'glow-soft': '0 16px 40px -18px rgba(148,66,104,0.28)',
        'glow-orchid':'0 22px 50px -22px rgba(189,127,175,0.45)',
        'glow-baby':  '0 22px 50px -22px rgba(94,148,181,0.40)',
        soft:        '0 12px 32px rgba(42,34,54,0.10)',
        card:        '0 10px 30px -14px rgba(42,34,54,0.18)',
        elevated:    '0 30px 60px -24px rgba(42,34,54,0.25)',
      },
      backgroundImage: {
        // Kept as aliases so any legacy `bg-brand-gradient` reference still
        // renders — but each resolves to a single flat Pantone now.
        'brand-gradient':   'linear-gradient(0deg, #944268, #944268)',  // solid Rose Shadow deep
        'pastel-gradient':  'linear-gradient(0deg, #efb3c7, #efb3c7)',  // solid Rose Shadow
        'sand-gradient':    'linear-gradient(0deg, #f8c49c, #f8c49c)',  // solid Bleached Apricot
        'radial-spot':      'linear-gradient(0deg, #fdf5f9, #fdf5f9)',  // flat rose-50 wash
        'cream-wash':       'linear-gradient(0deg, #fbf7f2, #fbf7f2)',  // flat pearl
      },
      keyframes: {
        shimmer: { '100%': { transform: 'translateX(100%)' } },
        'float-y': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-12px)' },
        },
        pulseDot: {
          '0%,100%': { transform: 'scale(1)',   opacity: 1 },
          '50%':     { transform: 'scale(1.6)', opacity: 0.4 },
        },
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'pastel-pan': {
          '0%,100%': { 'background-position': '0% 50%' },
          '50%':     { 'background-position': '100% 50%' },
        },
      },
      animation: {
        shimmer:      'shimmer 1.5s infinite',
        'float-y':    'float-y 6s ease-in-out infinite',
        'pulse-dot':  'pulseDot 1.6s ease-in-out infinite',
        marquee:      'marquee 28s linear infinite',
        'pastel-pan': 'pastel-pan 18s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
