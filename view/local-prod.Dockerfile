FROM node:24-alpine
WORKDIR /app/next-project
COPY ./next-project /app/next-project

ENV NODE_ENV=production
ENV NEXT_PUBLIC_APP_ENV=develop
ENV NEXT_PUBLIC_ENDPOINT=minio
ENV NEXT_PUBLIC_PORT=9000
ENV NEXT_PUBLIC_BUCKET_NAME=finansu
ENV NEXT_PUBLIC_MINIO_ENDPONT=http://localhost:9000
ENV NEXT_PUBLIC_ACCESS_KEY=user
ENV NEXT_PUBLIC_SECRET_KEY=password
ENV CI=true

RUN npm install -g pnpm@10.28.0
RUN pnpm install --frozen-lockfile
RUN pnpm run build
