/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'dark': '#0a0a0a',
        'dark-bg': '#0f0f0f',
        'dark-card': '#1a1a1a',
        'dark-border': '#2a2a2a',
        'neon-purple': '#b833ff',
        'neon-pink': '#ff00ff',
        'neon-cyan': '#00ffff',
        'success-green': '#10b981',
        'danger-red': '#ef4444',
        'warning-yellow': '#fbbf24',
        'accent-purple': '#8b5cf6',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(184, 51, 255, 0.3)',
        'glow-pink': '0 0 20px rgba(255, 0, 255, 0.3)',
        'glow-cyan': '0 0 20px rgba(0, 255, 255, 0.3)',
      },
      backdropFilter: {
        'glass': 'backdrop-filter: blur(10px)',
      },
    },
  },
  plugins: [],
}
