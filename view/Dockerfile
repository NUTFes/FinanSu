# Development Dockerfile
FROM node:24-alpine

# Install pnpm specific version globally
RUN npm install -g pnpm@10.28.0

# Set environment variables for pnpm
ENV PNPM_HOME=/pnpm
ENV PATH="$PNPM_HOME:$PATH"

# Create the pnpm directory and ensure permissions
# We need to ensure the node user (UID 1000) can write to /pnpm
RUN mkdir -p /pnpm/store && chown -R node:node /pnpm

# Set working directory
WORKDIR /app/next-project

# Switch to non-root user 'node' (UID 1000 provided by base image)
USER node

# Configure pnpm store directory as the user
RUN pnpm config set store-dir /pnpm/store

# Copy package.json and lockfile (optional as we use bind mount in dev, but good practice)
# COPY --chown=node:node next-project/package.json next-project/pnpm-lock.yaml ./
# RUN pnpm install --frozen-lockfile

# Note: In development with bind mounts, 'pnpm install' is usually run via command or entrypoint
