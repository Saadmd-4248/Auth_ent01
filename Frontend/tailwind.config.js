/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      // fontFamily: {
      //     sans: ['Outfit', 'sans-serif']
      // },
      colors: {
        brand: {
          50:  '#ECEEFF',
          100: '#D7DBFF',
          200: '#B0B6FF',
          300: '#8A91FF',
          400: '#656EFF',
          500: '#4E5BFF', // base
          600: '#3E4ACC',
          700: '#2F3999',
          800: '#202666',
          900: '#121733',
        },
        success: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
      },
    },
  },
  plugins: [],
};
