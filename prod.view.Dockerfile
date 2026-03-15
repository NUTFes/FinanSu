# Build用 コンテナ
FROM node:24-alpine AS base

FROM base AS builder

# build時に必要な環境変数
ARG NEXT_PUBLIC_APP_ENV=production
ARG NEXT_PUBLIC_MINIO_ENDPONT=http://localhost:9000
ENV NEXT_PUBLIC_APP_ENV=${NEXT_PUBLIC_APP_ENV} \
    NEXT_PUBLIC_MINIO_ENDPONT=${NEXT_PUBLIC_MINIO_ENDPONT} \
    DNS=8.8.8.8

WORKDIR /app

COPY ./view/next-project/package.json ./view/next-project/pnpm-lock.yaml ./
RUN npm install -g pnpm@10.28.0
RUN pnpm install --frozen-lockfile

COPY ./view/next-project/ ./
RUN pnpm run build

# Create runner image
FROM gcr.io/distroless/nodejs24-debian13:nonroot AS runner

WORKDIR /app
LABEL org.opencontainers.image.source="https://github.com/NUTFes/FinanSu"
ENV NODE_ENV=production

COPY --from=builder --chown=65532:65532 /app/.next/standalone /app/
COPY --from=builder --chown=65532:65532 /app/.next/static /app/.next/static
COPY --from=builder --chown=65532:65532 /app/public /app/public

ARG PORT=3000
ENV HOSTNAME=0.0.0.0
ENV PORT=${PORT}
EXPOSE ${PORT}

ENTRYPOINT [ "/nodejs/bin/node", "server.js" ]
