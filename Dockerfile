FROM node:20-alpine

# Install build dependencies required to build native modules if necessary
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies
RUN npm install --omit=dev

# Copy application code
COPY . .

# Expose default HTTP port
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Start application
CMD ["npm", "start"]
