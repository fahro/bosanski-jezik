/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        bosnia: {
          blue: '#002395',
          'blue-light': '#0033CC',
          'blue-dark': '#001566',
          yellow: '#FECB00',
          'yellow-light': '#FFD633',
          'yellow-dark': '#CC9F00',
          gold: '#FFD700',
        },
        accent: {
          teal: '#0D9488',
          coral: '#F97316',
          emerald: '#10B981',
          violet: '#8B5CF6',
        }
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 35, 149, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 35, 149, 0.8), 0 0 30px rgba(254, 203, 0, 0.4)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      },
      backgroundImage: {
        'bosnia-gradient': 'linear-gradient(135deg, #002395 0%, #0033CC 50%, #002395 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FECB00 0%, #FFD700 50%, #FECB00 100%)',
        'hero-pattern': 'radial-gradient(circle at 20% 50%, rgba(254, 203, 0, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(0, 35, 149, 0.1) 0%, transparent 50%)',
      },
      boxShadow: {
        'bosnia': '0 4px 14px 0 rgba(0, 35, 149, 0.25)',
        'gold': '0 4px 14px 0 rgba(254, 203, 0, 0.35)',
        'glow-blue': '0 0 15px rgba(0, 35, 149, 0.4)',
        'glow-yellow': '0 0 15px rgba(254, 203, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
