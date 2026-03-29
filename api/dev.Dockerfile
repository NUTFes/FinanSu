FROM golang:1.25.5-alpine

RUN apk add --no-cache bash tzdata

RUN addgroup -g 1000 gouser && \
    adduser -u 1000 -G gouser -s /bin/bash -D gouser

ENV GOCACHE=/go/cache
ENV GOMODCACHE=/go/pkg/mod
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV TZ=Asia/Tokyo

RUN go install github.com/deepmap/oapi-codegen/v2/cmd/oapi-codegen@v2.2.0 && \
    go install github.com/air-verse/air@latest

USER gouser

WORKDIR /app

CMD ["air", "-c", ".air.toml"]
