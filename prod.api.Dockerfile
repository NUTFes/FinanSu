# Build用 コンテナ
FROM golang:1.25.5-alpine AS builder
WORKDIR /app
COPY ./api /app
ENV CGO_ENABLED=0 \
    GOOS=linux
RUN go mod tidy
RUN go build -o ./main ./main.go

# 本番用 軽量 Debian 12 (bookworm)
FROM gcr.io/distroless/base-debian12:nonroot AS runner
LABEL org.opencontainers.image.source="https://github.com/NUTFes/FinanSu"
COPY --from=builder --chown=nonroot /app/main .
USER nonroot
EXPOSE 1323
CMD ["./main"]
