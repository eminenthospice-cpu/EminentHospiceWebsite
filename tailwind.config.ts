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
        heading: ['var(--font-playfair)', 'var(--font-noto-sans-kr)', 'Georgia', 'serif'],
        body:    ['var(--font-inter)', 'var(--font-noto-sans-kr)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'section-y': '5rem',
        'section-x': '1.5rem',
        'content':   '72rem',
      },
      maxWidth: {
        'content': '72rem',
        'prose':   '65ch',
      },
      borderRadius: {
        'card': '0.75rem',
        'btn':  '0.375rem',
      },
      boxShadow: {
        'card':    '0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-md': '0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        'header':  '0 1px 0 0 rgb(0 0 0 / 0.06)',
      },
      zIndex: {
        'fixed':   '50',
        'modal':   '100',
        'toast':   '200',
      },
      transitionDuration: {
        'ui': '200ms',
      },
    },
  },
  plugins: [],
};

export default config;
