/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#e2e8f0', // Dimmed off-white for better eye comfort
        background: '#030303',
        surface: '#080808',
        border: 'rgba(255, 255, 255, 0.03)',
        gray: {
          400: '#f1f5f9', // Near white - for the most important sub-labels
          500: '#e2e8f0', // Very light - for primary descriptions
          600: '#cbd5e1', // Light - for secondary labels
          700: '#94a3b8', // Medium - for background elements
        },
        neon: {
          cyan: '#00f5ff',
          purple: '#bc13fe',
          pink: '#ff00ff',
          amber: '#ffaa00',
          green: '#39ff14',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
