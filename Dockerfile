# ---- Build stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Install build deps
COPY package.json package-lock.json* ./
RUN npm ci --silent || npm install --silent

# Copy source and build
COPY . .
RUN npm run build

# ---- Production stage ----
FROM nginx:stable-alpine
# copy nginx config (we provide a custom config below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Ensure permissions are correct
RUN chown -R nginx:nginx /usr/share/nginx/html

# Expose 8080 to match dev expectation
EXPOSE 8080

# Start nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]