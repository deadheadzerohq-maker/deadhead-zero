/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        dzBg: "#020617",
        dzCard: "#020617",
        dzAccent: "#22c55e",
        dzAccentBlue: "#38bdf8"
      }
    }
  },
  plugins: []
}
