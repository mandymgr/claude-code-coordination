# Multi-stage production-optimized Docker build for KRINS-Universe-Builder
# Built for enterprise deployment with security hardening and performance optimization

# ===== SECURITY-HARDENED BUILD STAGE =====
FROM node:20-alpine AS builder

# Install security updates first
RUN apk update && apk upgrade && \
    apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    curl \
    ca-certificates \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Copy package files for all workspaces
COPY packages/shared/package*.json ./packages/shared/
COPY packages/ai-core/package*.json ./packages/ai-core/
COPY packages/cli/package*.json ./packages/cli/
COPY packages/mcp-server/package*.json ./packages/mcp-server/
COPY apps/backend/package*.json ./apps/backend/
COPY apps/frontend/package*.json ./apps/frontend/
COPY apps/extension/package*.json ./apps/extension/

# Install dependencies (use frozen lockfile for consistency)
RUN pnpm install --frozen-lockfile --production=false

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/ai-core ./packages/ai-core
COPY packages/cli ./packages/cli
COPY packages/mcp-server ./packages/mcp-server
COPY apps/backend ./apps/backend
COPY apps/frontend ./apps/frontend
COPY tsconfig.base.json ./

# Build shared package first
WORKDIR /app/packages/shared
RUN pnpm build

# Build server
WORKDIR /app/packages/server
RUN pnpm build

# Remove dev dependencies after build
WORKDIR /app
RUN pnpm install --frozen-lockfile --production=true

# ===== SECURITY-HARDENED PRODUCTION STAGE =====
FROM node:20-alpine AS production

# Install security updates and runtime dependencies
RUN apk update && apk upgrade && \
    apk add --no-cache \
    dumb-init \
    curl \
    postgresql-client \
    redis \
    ca-certificates \
    tzdata \
    && rm -rf /var/cache/apk/* \
    && rm -rf /tmp/*

# Create non-root user for security
RUN addgroup -g 1001 -S krins && \
    adduser -S krins -u 1001 -G krins

# Set security-focused environment variables
ENV NODE_ENV=production \
    NPM_CONFIG_UPDATE_NOTIFIER=false \
    NPM_CONFIG_FUND=false \
    PNPM_HOME="/pnpm" \
    PATH="$PNPM_HOME:$PATH"

# Set working directory
WORKDIR /app

# Copy built application from builder stage with proper ownership
COPY --from=builder --chown=claude:claude /app/node_modules ./node_modules
COPY --from=builder --chown=claude:claude /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder --chown=claude:claude /app/packages/shared/package.json ./packages/shared/
COPY --from=builder --chown=claude:claude /app/packages/server/dist ./packages/server/dist
COPY --from=builder --chown=claude:claude /app/packages/server/package.json ./packages/server/
COPY --from=builder --chown=claude:claude /app/package.json ./
COPY --from=builder --chown=claude:claude /app/pnpm-workspace.yaml ./

# Copy database schema and migrations
COPY --from=builder --chown=claude:claude /app/packages/server/src/database/schema.sql ./packages/server/dist/database/
COPY --from=builder --chown=claude:claude /app/packages/server/src/database/migrations ./packages/server/dist/database/migrations/

# Create required directories with proper permissions
RUN mkdir -p /app/logs /app/tmp /app/uploads /app/cache && \
    chown -R claude:claude /app/logs /app/tmp /app/uploads /app/cache && \
    chmod -R 750 /app/logs /app/tmp /app/uploads /app/cache

# Install pnpm in production image
RUN npm install -g pnpm@8.15.0

# Copy and make entrypoint script executable
COPY --chown=claude:claude docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Switch to non-root user for security
USER claude

# Enhanced health check with better timing for enterprise deployment
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/health || exit 1

# Expose application port
EXPOSE 8080

# Set resource limits and security labels
LABEL maintainer="KRINS-Universe-Builder Team" \
      version="3.0.0" \
      description="Ultimate AI Development Universe" \
      security.non-root="true" \
      security.hardened="true"

# Use dumb-init for proper signal handling in containerized environment
ENTRYPOINT ["dumb-init", "--"]

# Start the application using our custom entrypoint script
CMD ["./docker-entrypoint.sh"]

# ===== DEVELOPMENT STAGE =====
FROM node:20-alpine AS development

# Install dev dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    git \
    curl \
    postgresql-client \
    redis

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Copy package files
COPY package*.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./
COPY packages/shared/package*.json ./packages/shared/
COPY packages/server/package*.json ./packages/server/

# Install all dependencies (including dev)
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Create required directories
RUN mkdir -p /app/logs /app/tmp

# Expose port
EXPOSE 8080

# Start development server with hot reload
CMD ["pnpm", "--filter", "@claude-coordination/backend", "dev"]

# ===== TESTING STAGE =====
FROM development AS testing

# Install testing tools
RUN pnpm add -g vitest @vitest/ui

# Copy test files
COPY packages/server/src ./packages/server/src

# Run tests
CMD ["pnpm", "--filter", "@claude-coordination/backend", "test"]