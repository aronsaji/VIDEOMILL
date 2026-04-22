/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'mill-bg': '#050505',
        'accent-violet': '#8B5CF6',
        'accent-teal': '#2DD4BF',
        'mill-violet': '#8b5cf6',
        'mill-teal': '#14b8a6',
      },
      animation: {
        'glitch': 'glitch 1s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 2s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '2%, 64%': { transform: 'translate(2px, 0) skew(0deg)' },
          '4%, 60%': { transform: 'translate(-2px, 0) skew(0deg)' },
          '62%': { transform: 'translate(0, 0) skew(5deg)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px rgba(139, 92, 246, 0.6)' },
          '50%': { opacity: '0.5', boxShadow: '0 0 25px rgba(139, 92, 246, 0.3)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-50%)', opacity: '0' },
          '50%': { opacity: '0.5' },
          '100%': { transform: 'translateY(50%)', opacity: '0' },
        },
      },
      backgroundImage: {
        'neural-grid': 'linear-gradient(rgba(139, 92, 246, 0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'neural': '60px 60px',
      },
    },
  },
  plugins: [],
};