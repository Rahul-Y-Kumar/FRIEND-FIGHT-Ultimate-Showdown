/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#080808',
          900: '#101010',
          850: '#141414',
          800: '#1a1a1a',
          700: '#262626',
        },
        arcade: {
          red: '#E53935',
          'red-glow': '#FF1744',
          orange: '#FF8533',
          'orange-glow': '#FF9100',
          gold: '#FFD700',
          neon: '#00F0FF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Impact', 'Teko', 'Cabinet Grotesk', 'sans-serif'],
      },
      boxShadow: {
        'arcade-red': '0 0 25px rgba(229, 57, 53, 0.45)',
        'arcade-orange': '0 0 25px rgba(255, 133, 51, 0.45)',
        'arcade-gold': '0 0 25px rgba(255, 215, 0, 0.45)',
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite ease-in-out',
        'shake': 'shake 0.3s cubic-bezier(.36,.07,.19,.97) both',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.9', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.02)' },
        },
        shake: {
          '10%, 90%': { transform: 'translate3d(-1px, 0, 0)' },
          '20%, 80%': { transform: 'translate3d(2px, 0, 0)' },
          '30%, 50%, 70%': { transform: 'translate3d(-4px, 0, 0)' },
          '40%, 60%': { transform: 'translate3d(4px, 0, 0)' },
        }
      }
    },
  },
  plugins: [],
}
