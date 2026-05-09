FROM node:18-alpine

WORKDIR /app

# Install tools (bash, curl, netcat for health-wait)
RUN apk add --no-cache bash curl netcat-openbsd

COPY wait-for-mongo.sh /wait-for-mongo.sh
RUN chmod +x /wait-for-mongo.sh

# Copy dependency files first (layer caching)
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Create required directories with correct permissions
RUN mkdir -p public/uploads logs && chmod -R 755 public/uploads logs

# Non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

EXPOSE 5000

# Seed then start — env vars are injected by docker-compose at runtime
CMD ["sh", "-c", "/wait-for-mongo.sh && echo 'Running seed script...' && node seed.js && npm start"]