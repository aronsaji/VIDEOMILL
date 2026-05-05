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
        background: '#131314',
        surface: '#201f20',
        border: 'rgba(255, 255, 255, 0.1)',
        // Reference design system palette
        'surface-container': '#201f20',
        'surface-container-high': '#2a2a2b',
        'surface-container-low': '#1c1b1c',
        'surface-container-lowest': '#0e0e0f',
        'surface-container-highest': '#353436',
        'on-surface': '#e5e2e3',
        'primary-container': '#bd00ff',
        'secondary-container': '#00fe66',
        'secondary-fixed': '#6bff83',
        'secondary-fixed-dim': '#00e55b',
        'tertiary': '#ffb2ba',
        'tertiary-container': '#e90053',
        'primary': '#ecb2ff',
        'error': '#ffb4ab',
        gray: {
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
        },
        neon: {
          cyan: '#00f5ff',
          purple: '#bd00ff',
          pink: '#e90053',
          amber: '#ffaa00',
          green: '#6bff83',
        },
        brand: {
          1: '#6bff83',
          2: '#bd00ff',
        },
      },
      fontFamily: {
        sans: ['Be Vietnam Pro', 'Inter', 'sans-serif'],
        mono: ['Space Grotesk', 'JetBrains Mono', 'monospace'],
        headline: ['Epilogue', 'sans-serif'],
        'data-mono': ['Space Grotesk', 'monospace'],
        'label-caps': ['Space Grotesk', 'monospace'],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
