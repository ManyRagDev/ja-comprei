/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        sage: '#81B29A',
        terracotta: '#E07A5F',
        charcoal: '#3D405B',
        primary: '#81B29A', // Alias for Sage to match mockups
        accent: '#E07A5F', // Alias for Terracotta to match mockups
        'text-main': '#3D405B',
        'text-muted': '#687d73',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Lato', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'serif'], // Match mockup class
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'glow': '0 0 15px rgba(129, 178, 154, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 4s ease-in-out infinite',
        'tilt': 'rotate-slow 6s ease-in-out infinite',
        'steam-1': 'float 3s ease-in-out infinite',
        'steam-2': 'float 3s ease-in-out infinite 0.5s',
        'steam-3': 'float 3s ease-in-out infinite 1s',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-ring': {
          '0%, 100%': { transform: 'scale(0.95)', opacity: '0.5' },
          '50%': { transform: 'scale(1.05)', opacity: '0.8' },
        },
        'rotate-slow': {
          '0%, 100%': { transform: 'rotate(-5deg)' },
          '50%': { transform: 'rotate(5deg)' },
        },
      },
    },
  },
  plugins: [],
}
