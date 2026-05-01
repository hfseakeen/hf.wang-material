/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'albert-black': ['"MiSans Global"', '"MiSans"', 'system-ui', 'sans-serif'],
        'albert-bold': ['"MiSans Global"', '"MiSans"', 'system-ui', 'sans-serif'],
        'albert-semibold': ['"MiSans Global"', '"MiSans"', 'system-ui', 'sans-serif'],
        'albert-regular': ['"MiSans Global"', '"MiSans"', 'system-ui', 'sans-serif'],
        'albert-light': ['"MiSans Global"', '"MiSans"', 'system-ui', 'sans-serif'],
        'hanchanyuanyuan': ['"MiSans Global"', '"MiSans"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}