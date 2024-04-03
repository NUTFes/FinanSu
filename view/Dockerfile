# ベースイメージの作成
FROM node:16.13.0
# コンテナ内で作業するディレクトリを指定
WORKDIR /app/next-project
COPY ./ /app

ENV API_URL='http://localhost:1323'
ENV NEXT_PUBLIC_ENDPOINT='192.168.176.1'
ENV NEXT_PUBLIC_PORT=9000
ENV NEXT_PUBLIC_BUCKET_NAME='finansu'
ENV NEXT_PUBLIC_MINIO_ENDPONT='http://localhost:9000'
