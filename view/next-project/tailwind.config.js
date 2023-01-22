/** @type {import('tailwindcss').Config} */
module.exports = {
  tailwindConfig: './styles/tailwind.config.js',
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    colors: {
      'primary-1': '#56DAFF',
      'primary-2': '#1DBCC5',
      'primary-3': '#E2E8F0',
      'primary-4': '#023859',
      'primary-5': '#04668C',
      'accent-1': '#E4434E',
      'accent-2': '#FF5B6C',
      'base-1': '#2E373F',
      'base-2': '#FFF',
      'black-0': '#000',
      'black-300': '#333',
      'black-600': '#666',
      'black-900': '#999',
      'grey-50': '#f9fafb',
      'grey-100': '#f3f4f6',
      'grey-200': '#e5e7eb',
      'grey-300': '#d1d5db',
      'white-0': '#fff',
      'white-100': '#f2f2f2',
      'red-500': '#ef4444',
      'red-600': '#dc2626',
    },
    extend: {
      width: {
        '1/2': '50%',
        '3/4': '75%',
        '9/10': '90%',
        '1/7': '14.2857143%',
        '2/7': '28.5714286%',
        '3/7': '42.8571429%',
        '4/7': '57.1428571%',
        '5/7': '71.4285714%',
        '6/7': '85.7142857%',
        '1/8': '12.5%',
        '2/8': '25%',
        '3/8': '37.5%',
        '4/8': '50%',
        '5/8': '62.5%',
        '6/8': '75%',
        '7/8': '87.5%',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        '.text-shadow': {
          textShadow: '0px 2px 3px darkgrey',
        },
        '.text-shadow-md': {
          textShadow: '0px 3px 3px darkgrey',
        },
        '.text-shadow-logo': {
          textShadow: '4px 2px 0px #333',
        },
        '.text-shadow-none': {
          textShadow: 'none',
        },
      };

      addUtilities(newUtilities);
    },
  ],
};
