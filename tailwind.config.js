/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        condensed: ['"Barlow Condensed"', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff0f0',
          100: '#ffd6d6',
          400: '#ff3333',
          500: '#cc0000',
          600: '#a30000',
          700: '#7a0000',
          900: '#0a0000',
        },
      },
      backgroundImage: {
        'radial-red': 'radial-gradient(ellipse at top left, rgba(150,0,0,0.18) 0%, transparent 60%)',
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease-in-out forwards',
        'slide-up': 'slideUp 0.4s ease-out forwards',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
