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
        obsidian: '#06070B',
      },
      boxShadow: {
        glass:
          '0 24px 60px -24px rgba(0, 0, 0, 0.88), inset 0 1px 0 0 rgba(255, 255, 255, 0.09)',
        glow: '0 0 32px -4px rgba(129, 140, 248, 0.52)',
        crimsonGlow: '0 0 32px -4px rgba(244, 63, 94, 0.52)',
      },
    },
  },
  plugins: [],
};
