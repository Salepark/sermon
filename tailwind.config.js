/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
      },
      fontFamily: {
        serif: ['var(--font-noto-serif-kr)', 'Georgia', 'serif'],
        sans:  ['var(--font-noto-sans-kr)', 'system-ui', 'sans-serif'],
      },
      typography: (theme) => ({
        sermon: {
          css: {
            '--tw-prose-body':     theme('colors.stone[800]'),
            '--tw-prose-headings': theme('colors.stone[900]'),
            fontFamily: 'var(--font-noto-serif-kr), Georgia, serif',
            lineHeight: '2',
            fontSize:   '1.125rem',
          },
        },
      }),
    },
  },
  plugins: [],
};
