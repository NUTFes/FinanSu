/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{js,ts,jsx,tsx}"],
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  // content: [
  //   "./src/pages/**/*.{js,ts,jsx,tsx}",
  //   "./src/components/**/*.{js,ts,jsx,tsx}",
  // ],
  theme: {
    colors: {
      'primary-1': '#56DAFF',
      'primary-2': '#1DBCC5',
      'primary-3': '#E2E8F0',
      'accent-1': '#E4434E',
      'accent-2': '#FF5B6C',
      'base-1': '#2E373F',
      'base-2': '#FFF',
      'black-0': '#000',
      'black-300': '#333',
      'black-600': '#666',
      'black-900': '#999',
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
      }
    },
  },
  plugins: [],
}
