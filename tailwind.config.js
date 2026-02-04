/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        serif: ['"Noto Serif SC"', 'serif'],
        calligraphy: ['"Ma Shan Zheng"', 'cursive'],
      },
      backgroundImage: {
        'paper-pattern': "url('https://www.transparenttextures.com/patterns/rice-paper-2.png')",
        'cloud-pattern': "url('https://www.transparenttextures.com/patterns/clouds.png')",
      }
    },
  },
  plugins: [],
};
