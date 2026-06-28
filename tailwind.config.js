/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index-new.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['Manrope', 'sans-serif'],
      },
      colors: {
        'accent-flame': '#ff4d00',
        'accent-ice': '#00f0ff',
        'accent-gold': '#ffd700',
        'accent-blood': '#dc143c',
      },
    },
  },
  plugins: [],
}
