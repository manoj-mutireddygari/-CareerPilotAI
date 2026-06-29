import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif']
      },
      colors: {
        ink: '#050505',
        graphite: '#141414',
        mist: '#F7F4EE',
        signal: '#50E3C2',
        ember: '#FF7A3D',
        solar: '#F6C445',
        skyglass: '#8FD7FF'
      },
      boxShadow: {
        glow: '0 0 60px rgba(80, 227, 194, 0.28)',
        ember: '0 0 70px rgba(255, 122, 61, 0.22)'
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        float: 'float 6s ease-in-out infinite',
        pulseGlow: 'pulseGlow 2.8s ease-in-out infinite'
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-18px)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 rgba(80, 227, 194, 0)' },
          '50%': { boxShadow: '0 0 44px rgba(80, 227, 194, 0.4)' }
        }
      }
    }
  },
  plugins: []
} satisfies Config;
