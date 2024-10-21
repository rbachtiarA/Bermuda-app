const { nextui } = require("@nextui-org/react");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",

    "../../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      container: {
        center: true,
        screens: {
          sm: '100%',
          md: '470px',
          lg: '930px',
          xl: '1110px'
        }
      }
    },
  },
  darkmode: "class",
  plugins: [nextui()],
}

