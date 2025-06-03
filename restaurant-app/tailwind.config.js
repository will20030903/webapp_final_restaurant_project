/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F2937',      // Deep cool gray (gray-800)
        secondary: '#4A5568',    // Medium-dark gray (gray-600)
        accent: '#D97706',       // Amber 600 (for specific highlights)
        'text-primary': '#1F2937',
        'text-secondary': '#4B5563',
        'background-light': '#E5E7EB',
        'background-dark': '#FFFFFF',
        'border-color': '#D1D5DB',
        'success': '#10B981',
        'error': '#EF4444',
      },
      fontFamily: {
        sans: ['"Open Sans"', 'sans-serif'], // Body font
        heading: ['Montserrat', 'sans-serif'], // Heading font
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms')
  ],
}
