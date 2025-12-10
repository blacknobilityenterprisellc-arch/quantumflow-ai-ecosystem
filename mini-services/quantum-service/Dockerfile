# 🐳 Quantum Service Dockerfile
FROM node:20-alpine

# Security: Non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S quantum-service -u 1001

# Install dependencies
WORKDIR /app

COPY package*.json ./
RUN npm install --production=only

# Copy source code
COPY --chown=quantum-service:nodejs . .

# Switch to non-root user
USER quantum-service

EXPOSE 3003

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3003/health || exit 1

CMD ["node", "index.js"]