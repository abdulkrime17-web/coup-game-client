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
        obsidian: '#07070A',
      },
      boxShadow: {
        glass:
          '0 24px 60px -24px rgba(0, 0, 0, 0.85), inset 0 1px 0 0 rgba(255, 255, 255, 0.09)',
        glow: '0 0 32px -4px rgba(251, 191, 36, 0.45)',
        crimsonGlow: '0 0 32px -4px rgba(239, 68, 68, 0.5)',
      },
    },
  },
  plugins: [],
};
