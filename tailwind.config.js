/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'primary-green': '#2CA673',
        'primary-dark': '#141A18',
        'primary-light': '#f5f5f5',
        'accent-yellow': '#FFDD8C',
        'accent-gold': '#EAC66E',
        'secondary-gray': '#8C8C8C',
        'secondary-blue': '#2E72A9',
        success: '#50E5A7',
      },
      fontFamily: {
        'gilroy-medium': ['GilroyMedium', 'sans-serif'],
        'gilroy-regular': ['GilroyRegular', 'sans-serif'],
        'gilroy-semibold': ['GilroySemiBold', 'sans-serif'],
        'gilroy-extrabold': ['GilroyExtraBold', 'sans-serif'],
        'gilroy-light': ['GilroyLight', 'sans-serif'],
        'asikh-logo': ['AsikhLogo', 'sans-serif'],
      },
      height: {
        128: '32rem',
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
};
