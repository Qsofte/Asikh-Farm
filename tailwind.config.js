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
      keyframes: {
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-1.25rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(1.25rem)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        // `both` keeps the element hidden through the delay and holds the
        // final frame afterwards, so no opacity-0 class is needed in markup.
        'fade-in-down': 'fadeInDown 1s ease-out both',
        'fade-in-up': 'fadeInUp 1s ease-out both',
        'fade-in-up-delay-500': 'fadeInUp 1s ease-out 0.5s both',
        'fade-in-up-delay-1000': 'fadeInUp 1s ease-out 1s both',
      },
      screens: {
        xs: '475px',
      },
    },
  },
  plugins: [],
};
