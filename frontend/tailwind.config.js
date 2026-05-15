/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#7B1C2E',
          light:   '#9B2335',
          50:      '#FCEEF1',
          100:     '#F5D0D7',
          200:     '#E8A0B0',
        },
        gold: {
          DEFAULT: '#B8860B',
          dark:    '#8B6914',
          50:      '#FBF5E6',
          100:     '#F0D98A',
        },
        cream: {
          DEFAULT: '#FDFAF5',
          100:     '#F7F2EA',
          200:     '#EDE4D4',
        },
        ink: {
          DEFAULT: '#1E0F08',
          200:     '#5C3D2E',
          300:     '#9C7B6A',
        },
        border: '#E2D0BC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}