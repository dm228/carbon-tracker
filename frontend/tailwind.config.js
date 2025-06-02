/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        primary: '#4CAF50',
        secondary: '#81C784',
        background: '#F5F5F5',
        card: '#FFFFFF',
        text: '#333333'
      },
      fontFamily: {
        sans: ['"Helvetica Neue"', 'Arial', 'sans-serif']
      }
    }
  },
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ]
}
