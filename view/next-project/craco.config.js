const path = require('path');

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  // webpack setting
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src/'),
    },
  },
};
