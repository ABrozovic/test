/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],

  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.5s",
      },
      keyframes: {
        fadeIn: {
          from: {
            opacity: 0,
          },
          to: {
            opacity: 1,
          },
        },
      },
      colors: {
        transparent: "transparent",
        current: "currentColor",
        darkpurple: "#260C1A",
        lavender: "#695569",
        test: "#EB9B96",
      },
    },
  },
  darkMode: "class",
  plugins: [require("@tailwindcss/forms")],
};
