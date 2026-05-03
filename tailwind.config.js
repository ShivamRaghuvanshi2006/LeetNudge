/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./extension/**/*.{html,js,css}",
  ],
  theme: {
    extend: {
      colors: {
        neo: {
          bg: 'var(--neo-bg)',
          black: 'var(--neo-black)',
          accent: 'var(--neo-accent)',
          secondary: 'var(--neo-secondary)',
          muted: 'var(--neo-muted)',
        }
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'neo-sm': '4px 4px 0px 0px #000',
        'neo-md': '8px 8px 0px 0px #000',
        'neo-lg': '12px 12px 0px 0px #000',
        'neo-xl': '16px 16px 0px 0px #000',
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        'shake': 'shake 0.3s infinite',
      },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translate(1px, 1px) rotate(0deg)' },
          '10%': { transform: 'translate(-1px, -2px) rotate(-1deg)' },
          '30%': { transform: 'translate(4px, 2px) rotate(0deg)' },
          '50%': { transform: 'translate(-1px, 2px) rotate(-2deg)' },
          '70%': { transform: 'translate(4px, 1px) rotate(-2deg)' },
          '90%': { transform: 'translate(1px, 2px) rotate(0deg)' },
        }
      }
    },
  },
  plugins: [],
}
