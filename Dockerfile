# Stage 1: Build the React application
FROM node:24 AS build

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./

# Install dependencies (uses npm by default; replace if you use pnpm/yarn)
RUN npm install --no-audit --no-fund

# Copy the rest of the source and build
COPY . .
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output from the build stage to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Copy a custom Nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
