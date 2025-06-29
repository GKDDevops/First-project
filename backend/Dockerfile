FROM node:20-alpine
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Use npm ci for deterministic installs (matches package-lock.json exactly)
RUN npm ci

# Copy app source
COPY . .

# Set PORT only (MONGODB_URI moved to runtime environment)
ENV PORT=5000
EXPOSE 5000

# Start command
CMD ["npm", "start"]
