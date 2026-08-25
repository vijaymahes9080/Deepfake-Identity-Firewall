/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-bg': '#06090e',
        'cyber-card': 'rgba(13, 19, 30, 0.75)',
        'neon-emerald': '#00f5a0',
        'neon-cyan': '#00d4ff',
        'neon-amber': '#ffb703',
        'neon-orange': '#ff5400',
        'neon-crimson': '#ff0055',
        'neon-purple': '#b5179e',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Chakra Petch', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
