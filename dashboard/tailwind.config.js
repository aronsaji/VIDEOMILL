/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--bg-deep)',
        surface: 'var(--bg-surface)',
        border: 'var(--border-color)',
        neon: {
          cyan: 'var(--neon-cyan)',
          amber: 'var(--neon-amber)',
          purple: 'var(--neon-purple)',
          red: '#FF2A2A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M0 40L40 40L40 0' fill='none' stroke='white' stroke-opacity='0.05' stroke-width='1'/%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
}
