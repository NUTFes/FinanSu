FROM golang:1.25.5-alpine

# Install git (required for go mod) and bash
RUN apk add --no-cache git bash

# Create a non-root user with UID 1000
RUN adduser -D -u 1000 appuser

# Set environment variables
ENV CGO_ENABLED=0 \
    GOOS=linux \
    GOCACHE=/go/pkg/build-cache \
    GOMODCACHE=/go/pkg/mod

# Create cache directories and set permissions
RUN mkdir -p /go/pkg/build-cache /go/pkg/mod && \
    chown -R appuser:appuser /go

# Set working directory
WORKDIR /app

# Switch to non-root user
USER appuser

# Install development tools
RUN go install github.com/deepmap/oapi-codegen/v2/cmd/oapi-codegen@v2.2.0 && \
    go install github.com/air-verse/air@latest

# The source code will be mounted via volume in docker-compose
# but we can copy it here for completeness/fallback
COPY --chown=appuser:appuser . /app

CMD ["air", "-c", ".air.toml"]
