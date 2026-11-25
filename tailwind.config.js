/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Cairo"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        obsidian: '#09090B',
      },
      boxShadow: {
        glass: '0 20px 50px -20px rgba(0, 0, 0, 0.75), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
        glow: '0 0 24px -4px rgba(251, 191, 36, 0.35)',
      },
    },
  },
  plugins: [],
};
