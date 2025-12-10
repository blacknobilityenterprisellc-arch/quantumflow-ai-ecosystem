# 🐳 Auth Service Dockerfile
FROM node:20-alpine

# Security: Non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S auth-service -u 1001

# Install dependencies
WORKDIR /app

COPY package*.json ./
RUN npm install --production=only

# Copy source code
COPY --chown=auth-service:nodejs . .

# Switch to non-root user
USER auth-service

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "index.js"]