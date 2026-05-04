/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: '#ffffff',
        background: '#020617', // Obsidian Black-Blue
        surface: '#0f172a',    // Slate Dark
        border: 'rgba(255, 255, 255, 0.1)',
        gray: {
          400: '#ffffff',
          500: '#f8fafc',
          600: '#f1f5f9',
          700: '#e2e8f0',
        },
        neon: {
          cyan: '#fbbf24', // Amber Gold
          purple: '#f59e0b', // Solid Gold
          pink: '#f43f5e',
          amber: '#fbbf24',
          green: '#22c55e',
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
