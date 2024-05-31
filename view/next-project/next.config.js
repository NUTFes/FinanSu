/** @type {import('next').NextConfig} */
const isProd = process.env.NEXT_PUBLIC_APP_ENV === 'production';

module.exports = {
  reactStrictMode: true,
  env: {
    SSR_API_URI: process.env.NEXT_PUBLIC_SSR_API_URI,
    CSR_API_URI: process.env.NEXT_PUBLIC_CSR_API_URI,
  },
};
