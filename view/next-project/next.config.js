/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  reactStrictMode: true,
  env: {
    SSR_API_URI: isProd ? 'http://nutfes-finansu-api:1323' : 'http://nutfes-finansu-api:1323',
    CSR_API_URI: isProd ? 'http://localhost:1323' : 'http://localhost:1323',
  },
};
