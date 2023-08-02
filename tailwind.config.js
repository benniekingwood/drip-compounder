/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["lofi"],
  },
};
