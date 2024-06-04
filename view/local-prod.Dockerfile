FROM node:20.14
WORKDIR /app/next-project
COPY ./next-project /app/next-project

ENV NODE_ENV production
ENV NEXT_PUBLIC_APP_ENV "develop"

RUN npm install --production
RUN npm run build
