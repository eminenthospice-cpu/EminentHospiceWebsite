import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C5F8A',
          50:  '#EBF3FA',
          100: '#C8DFF0',
          200: '#A5CBE6',
          300: '#82B7DC',
          400: '#5FA3D2',
          500: '#2C5F8A',
          600: '#245079',
          700: '#1C4168',
          800: '#143257',
          900: '#0C2346',
        },
        secondary: {
          DEFAULT: '#7CB9E8',
          500: '#7CB9E8',
          600: '#5EA8E0',
        },
        accent: {
          warm: {
            50:  '#FBF4E8',
            100: '#F4E4C9',
            200: '#E8D5B7',
            300: '#D7BC8E',
            400: '#C6A465',
            500: '#B08458',
            600: '#8A6645',
            700: '#604631',
          },
          sage: {
            50:  '#EEF5EF',
            100: '#D4E4D8',
            200: '#B6D2BC',
            300: '#94BB9C',
            400: '#72A37C',
            500: '#4A7C59',
            600: '#3B6347',
            700: '#2A4733',
          },
        },
        ink: {
          900: '#1F2A37',
          700: '#3D4A5C',
          500: '#5F6B7A',
          300: '#94A0AE',
        },
        tint: {
          ivory: '#FEFCF7',
          dust:  '#EFEBE4',
        },
        line: {
          hairline: 'rgba(31,42,55,0.08)',
          soft:     'rgba(31,42,55,0.14)',
        },
        surface: {
          paper:    '#FBF8F3',
          elevated: '#FFFFFF',
          ink:      '#1A2B3C',
          canvas:   '#FAF6F0',
        },
        neutral: {
          warm:  '#F8F6F2',
          cream: '#FDF9F5',
          100: '#F1EDE8',
          200: '#E2DDD7',
          300: '#C8C2BB',
        },
        success: '#4A9B6F',
        warning: '#C27D2A',
        error:   '#B94040',
        'text-primary':   '#1A2B3C',
        'text-secondary': '#4A5568',
        'text-muted':     '#718096',
      },
      fontFamily: {
        // Editorial display: Fraunces (variable, optical sizes). Keep Playfair as fallback.
        heading: ['var(--font-fraunces)', 'var(--font-playfair)', 'var(--font-noto-serif-kr)', 'var(--font-noto-sans-kr)', 'Georgia', 'serif'],
        // Long-form prose: Newsreader. Falls back to Inter for UI text.
        prose:   ['var(--font-newsreader)', 'var(--font-noto-serif-kr)', 'Georgia', 'serif'],
        // UI / body
        body:    ['var(--font-inter)', 'var(--font-noto-sans-kr)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Editorial display scale (clamp-based for fluid responsiveness)
        'display-2xl': ['clamp(3rem, 6vw, 5.5rem)',   { lineHeight: '1.02', letterSpacing: '-0.025em' }],
        'display-xl':  ['clamp(2.5rem, 4.5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.022em' }],
        'display-lg':  ['clamp(2rem, 3.5vw, 3rem)',   { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
        'eyebrow':     ['0.75rem',                    { lineHeight: '1.2',  letterSpacing: '0.18em' }],
        'pull-quote':  ['clamp(1.5rem, 2.5vw, 2.25rem)', { lineHeight: '1.3', letterSpacing: '-0.01em' }],
        'display-3xl': ['clamp(4rem, 9vw, 8rem)',    { lineHeight: '0.92', letterSpacing: '-0.035em' }],
        'numeral-xl':  ['clamp(5rem, 11vw, 9rem)',   { lineHeight: '0.95', letterSpacing: '-0.04em' }],
        'lead':        ['1.375rem',                  { lineHeight: '1.6',  letterSpacing: '-0.005em' }],
        'marginalia':  ['0.8125rem',                 { lineHeight: '1.45', letterSpacing: '0.005em' }],
      },
      spacing: {
        'section-y':    '5rem',
        'section-2xl':  '6.5rem',
        'section-3xl':  '8rem',
        'section-x':    '1.5rem',
        'content':      '72rem',
      },
      maxWidth: {
        'content':      '72rem',
        'content-wide': '90rem',
        'prose':        '65ch',
        'prose-wide':   '78ch',
        'prose-narrow': '52ch',
      },
      borderRadius: {
        'card':    '0.75rem',
        'btn':     '0.375rem',
        'organic': '1.25rem',
      },
      boxShadow: {
        'card':        '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-md':     '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'card-lg':     '0 12px 24px -8px rgb(20 50 87 / 0.12), 0 4px 8px -4px rgb(20 50 87 / 0.06)',
        'header':      '0 1px 0 0 rgb(0 0 0 / 0.06)',
        'paper':       '0 1px 0 0 rgb(176 132 88 / 0.08), 0 12px 32px -12px rgb(20 50 87 / 0.08)',
        'soft':        '0 2px 8px -2px rgb(31 42 55 / 0.06), 0 8px 24px -8px rgb(31 42 55 / 0.08)',
        'float':       '0 4px 16px -4px rgb(31 42 55 / 0.1), 0 16px 40px -12px rgb(31 42 55 / 0.12)',
        'inset-line':  'inset 0 1px 0 0 rgb(31 42 55 / 0.06)',
      },
      backgroundImage: {
        'gradient-dawn': 'linear-gradient(135deg, #FDF9F5 0%, #EBF3FA 100%)',
        'gradient-mist': 'linear-gradient(180deg, #EBF3FA 0%, rgba(124, 185, 232, 0.12) 100%)',
        'gradient-paper': 'linear-gradient(180deg, #FBFAF7 0%, #F8F6F2 100%)',
      },
      zIndex: {
        'fixed':   '50',
        'modal':   '100',
        'toast':   '200',
      },
      transitionDuration: {
        'ui':   '200ms',
        'fast': '180ms',
        'base': '280ms',
        'slow': '480ms',
      },
      transitionTimingFunction: {
        'editorial': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'snap':      'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 280ms cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 280ms ease-out both',
        'accordion-down': 'accordion-down 200ms ease-out',
        'accordion-up':   'accordion-up 200ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
