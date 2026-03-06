/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ozalit-bg': '#001e36',
        'ozalit-grid': '#00223e',
        'ozalit-panel': '#001528',
        'earth-bg': '#0a0c10',
        'earth-grid': '#181f21',
        'earth-panel': '#151820',
        'islamic-gold': '#d4af37',
        'eco-green': '#2e7d32',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'Courier New', 'monospace'],
      },
      backgroundImage: {
        'blueprint': "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
      }
    },
  },
  plugins: [],
}
