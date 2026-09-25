# --- STAGE 1: Build the Angular App ---
FROM node:24-alpine AS builder

WORKDIR /app

# Copy dependency configs first to utilize Docker layer cache
COPY package*.json ./
RUN npm ci

# Copy the application source code
COPY . .

# Build the project for production (Matches "build": "ng build" in your package.json)
RUN npm run build

# --- STAGE 2: Serve with Nginx ---
FROM nginx:1.30.5-alpine

# Clear the default Nginx index pages
RUN rm -rf /usr/share/nginx/html/*

# Copy the output targeting your specific project output location
# Angular 22 application builder outputs to 'dist/<projectName>/browser'
COPY --from=builder /app/dist/angularApp/browser /usr/share/nginx/html

# Apply custom routing patterns for Angular router support
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
