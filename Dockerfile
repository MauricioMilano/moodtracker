# Stage 1: Build the React application
FROM node:24 AS build

WORKDIR /
COPY package.json package-lock.json ./
# RUN apk update && apk add npm
# RUN npm install -g npm@11.4.1
# RUN apk add --no-cache build-base nasm
COPY . .
RUN npm install

RUN npx vite build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

# Copy the build output from the build stage to the Nginx public directory
COPY --from=build /dist /usr/share/nginx/html

# Optional: Copy a custom Nginx configuration if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
