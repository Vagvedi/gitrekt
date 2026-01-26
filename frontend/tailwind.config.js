export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        dark: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#0f1419',
          950: '#030712',
        },
        neon: {
          purple: '#a855f7',
          cyan: '#06b6d4',
          green: '#10b981',
          red: '#ef4444',
        },
      },
      fontFamily: {
        mono: ['Courier New', 'monospace'],
      },
      animation: {
        glitch: 'glitch 0.4s infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        typewriter: 'typewriter 0.05s steps(1) forwards',
      },
      keyframes: {
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        typewriter: {
          '100%': { 'border-right-color': 'transparent' },
        },
      },
    },
  },
  darkMode: 'class',
  plugins: [],
};
