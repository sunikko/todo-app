/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#0d9488',
          light: '#14b8a6',
          dark: '#0f766e',
          tint: '#ccfbf1',
        },
        surface: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
        },
      },
      boxShadow: {
        soft: '0 2px 8px rgb(15 23 42 / 0.06)',
        'soft-lg': '0 4px 20px rgb(15 23 42 / 0.08)',
        glow: '0 0 0 3px rgb(13 148 136 / 0.2)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
};
