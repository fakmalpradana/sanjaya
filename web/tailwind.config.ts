import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Archivo', 'system-ui', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        cream: '#FBF7EF',
        ink: '#141414',
        accent: '#FFD23F',
        danger: '#FF4D4D',
        muted: '#8A8270',
        border: '#E6DFCD',
      },
    },
  },
  plugins: [],
} satisfies Config;
