/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#0f172a',
        },
        navy: {
          950: '#070e1e', // App body dark background
          900: '#0c1730', // Secondary background
          850: '#0f1d3b', // Primary card background (from screenshot)
          800: '#132448', // Card inner / input background
          750: '#172b55', // Hover card background
          700: '#1e3669', // Borders & separators
          600: '#2b4985',
        },
        emeraldchip: {
          bg: '#062d29',
          border: '#10b981',
          text: '#6ee7b7',
        },
        orangechip: {
          bg: '#2b1414',
          border: '#f97316',
          text: '#fdba74',
        },
        neutralchip: {
          bg: '#14254b',
          border: '#1f3769',
          text: '#cbd5e1',
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.8' },
          '50%': { opacity: '0.4' },
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite',
        pulseGlow: 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
