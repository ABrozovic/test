/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        transparent: "transparent",
        current: "currentColor",
        darkpurple: "#260C1A",
        lavender: "#826982",
        test: "#EB9B96",
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
