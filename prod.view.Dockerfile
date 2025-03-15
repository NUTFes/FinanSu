# Build用 コンテナ
FROM node:20.14 AS builder
WORKDIR /app/next-project
COPY ./view/next-project /app/next-project
RUN npm install
RUN npm run build

# 本番用 軽量 nodejs20.14
FROM node:20.14-slim
WORKDIR /app
LABEL org.opencontainers.image.source="https://github.com/NUTFes/FinanSu"
ENV NODE_ENV production
ENV NEXT_PUBLIC_APP_ENV "production"

COPY --from=builder /app/next-project/next.config.js ./
COPY --from=builder /app/next-project/public ./public
COPY --from=builder --chown=nonroot:nonroot /app/next-project/.next ./.next
COPY --from=builder /app/next-project/node_modules ./node_modules
COPY --from=builder /app/next-project/package.json ./package.json

USER nonroot
EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
