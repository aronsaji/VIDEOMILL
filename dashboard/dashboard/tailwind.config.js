/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Use CSS variables for theming
        "background": "var(--background)",
        "surface": "var(--surface)",
        "surface-container": "var(--surface-container)",
        "surface-container-low": "var(--surface-container-low)",
        "primary": "var(--primary)",
        "primary-container": "var(--primary-container)",
        "secondary": "var(--secondary)",
        "secondary-container": "var(--secondary-container)",
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        "on-primary-container": "var(--on-primary-container)",
        "outline": "var(--outline)",
        "error": "var(--error)",
        "success": "var(--success)",
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "0.75rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
        "5xl": "3rem",
      },
      fontFamily: {
        "body-lg": ["Epilogue", "sans-serif"],
        "body-md": ["Epilogue", "sans-serif"],
        "label-sm": ["JetBrains Mono", "monospace"],
        "headline-lg": ["Space Grotesk", "sans-serif"],
        "headline-md": ["Space Grotesk", "sans-serif"],
      },
      animation: {
        'spin-slow': 'spin 12s linear infinite',
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
