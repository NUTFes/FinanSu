/** @type {import('next').NextConfig} */
const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production';

module.exports = {
  reactStrictMode: true,
  env: {
    SSR_API_URI: isProd ? 'https://finansu-api.nutfes.net' : 'http://nutfes-finansu-api:1323',
    CSR_API_URI: isProd ? 'https://finansu-api.nutfes.net' : 'http://localhost:1323',
  },
};
