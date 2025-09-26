/** @type {import('next').NextConfig} */

// 現在の環境を取得（未定義の場合は 'development' とする）
const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || 'development';

// 各環境に応じたAPIエンドポイントの設定
const apiConfig = {
  production: {
    SSR_API_URI: 'https://finansu-api.nutfes.net',
    CSR_API_URI: 'https://finansu-api.nutfes.net',
  },
  stg: {
    SSR_API_URI: 'https://stg-finansu-api.nutfes.net',
    CSR_API_URI: 'https://stg-finansu-api.nutfes.net',
  },
  development: {
    SSR_API_URI: 'http://nutfes-finansu-api:1323',
    CSR_API_URI: 'http://localhost:1323',
  },
};

// 現在の環境に合った設定を展開（該当しない場合はdevelopment設定を利用）
const { SSR_API_URI, CSR_API_URI } = apiConfig[APP_ENV] || apiConfig.development;

module.exports = {
  reactStrictMode: true,
  env: {
    SSR_API_URI,
    CSR_API_URI,
  },
  output: 'standalone',
};
