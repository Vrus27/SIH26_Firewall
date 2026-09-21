/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        privacy: {
          dark: '#0B0F19',
          card: '#111827',
          border: '#1F2937',
          emerald: '#10B981',
          shield: '#059669',
          danger: '#EF4444',
          warning: '#F59E0B',
          accent: '#3B82F6'
        }
      },
      fontFamily: {
        mono: ['Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}
