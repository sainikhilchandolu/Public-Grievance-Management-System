/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#eef5fc',
          100: '#d4e5f7',
          200: '#93bded',
          300: '#558ed6',
          400: '#2d6bb8',
          500: '#1b5094',
          600: '#123e75',
          700: '#0B2E59', // Primary Navy Blue
          800: '#072347',
          900: '#051833',
        },
        saffron: {
          50:  '#fff7ed',
          100: '#ffedd5',
          300: '#ffc285',
          400: '#ffa852',
          500: '#FF9933', // Saffron Accent
          600: '#db4f00',
          700: '#b83f00',
          900: '#7c2600',
        },
        gov: {
          green: '#15803d',
          red: '#b91c1c',
          yellow: '#a16207',
          purple: '#6d28d9',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'Noto Sans', 'system-ui', 'sans-serif'],
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      boxShadow: {
        'gov-sm': '0 1px 3px rgba(0,0,0,.08)',
        'gov-md': '0 4px 6px rgba(0,0,0,.07)',
        'gov-lg': '0 10px 15px rgba(0,0,0,.1)',
      },
      borderRadius: {
        'gov': '8px',
        'gov-lg': '12px',
        'gov-xl': '16px',
      },
      animation: {
        'fade-in': 'fadeIn 0.35s ease both',
        'slide-left': 'slideInLeft 0.3s ease both',
        'scale-in': 'scaleIn 0.3s ease both',
        'pulse-slow': 'pulse 3s infinite',
      }
    },
  },
  plugins: [],
};