FROM node:24-alpine

RUN apk add --no-cache bash

# コンテナ内で作業するディレクトリを指定
WORKDIR /app/next-project

ENV API_URL='http://localhost:1323'

RUN npm install -g pnpm@10.28.0

USER node
