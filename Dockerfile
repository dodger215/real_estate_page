# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install necessary tools
RUN apk add --no-cache bash curl

# Copy package files
COPY package*.json ./
COPY package-lock.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application source
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads && \
    chmod -R 755 public/uploads

# Create logs directory
RUN mkdir -p logs

# Create non-root user (for security)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:5000/health || exit 1

# Expose port
EXPOSE 5000

# Run seed and start application
CMD ["sh", "-c", "echo 'Running seed script...' && node seed.js && echo 'Starting application...' && node index.js"]