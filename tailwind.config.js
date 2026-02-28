/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        butterpop: ['Butterpop', 'cursive'],
        stretchpro: ['StretchPro', 'sans-serif'],
      },

      colors: {
        primary: "#335eea",
        primary1: "#5ffd00",
        primary2: "#0b2c5f",
      },
    },
  },
  plugins: [],
}