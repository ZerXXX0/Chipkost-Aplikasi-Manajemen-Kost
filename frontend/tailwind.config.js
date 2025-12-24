/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#4263EB',
        'subtle-gray': '#6B7280',
        'border-gray': '#D1D5DB',
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',  // blue-500
          600: '#2563eb',  // blue-600
          700: '#1d4ed8',  // blue-700
        },
        secondary: {
          500: '#6366f1',  // indigo-500
          600: '#4f46e5',  // indigo-600
        },
        // Tambahkan warna lain dari design Anda
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        // Extract spacing values dari Figma
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        // Extract border radius dari design
        '4xl': '2rem',
      },
      boxShadow: {
        // Extract shadow values
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'medium': '0 4px 25px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
}
