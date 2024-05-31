FROM node:20.14
WORKDIR /app/next-project
COPY ./ /app

ENV NODE_ENV production
ENV NEXT_PUBLIC_APP_ENV "production"

RUN npm install --production
RUN npm run build

