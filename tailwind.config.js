/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { 'text-shadow': '0 0 10px rgba(34,211,238,0.7)' },
          '100%': { 'text-shadow': '0 0 20px rgba(34,211,238,0.9)' },
        },
      },
    },
  },
  plugins: [],
};