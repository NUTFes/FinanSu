# Build用 コンテナ
FROM node:20-alpine AS base

FROM base AS builder

WORKDIR /app

COPY ./view/next-project/package*.json ./
RUN npm ci


COPY ./view/next-project/ ./
RUN npm run build

# Create runner image
FROM gcr.io/distroless/nodejs20-debian12:nonroot AS runner

WORKDIR /app
LABEL org.opencontainers.image.source="https://github.com/NUTFes/FinanSu"
ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_ENV="production"

COPY --from=builder --chown=65532:65532 /app/.next/standalone /app/
COPY --from=builder --chown=65532:65532 /app/.next/static /app/.next/static
COPY --from=builder --chown=65532:65532 /app/public /app/public

ARG PORT=3000
ENV HOSTNAME=0.0.0.0
ENV PORT=${PORT}
EXPOSE ${PORT}

ENTRYPOINT [ "/nodejs/bin/node", "server.js" ]
