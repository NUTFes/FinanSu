# ベースイメージの作成
FROM node:24-slim
RUN npm install -g pnpm
# コンテナ内で作業するディレクトリを指定
WORKDIR /app/next-project
COPY ./ /app

ENV API_URL='http://localhost:1323'
