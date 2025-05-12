# Step 1: Build the app
FROM node:18 AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the Vite app
RUN npm run build

# Step 2: Serve the app using `serve`
FROM node:18-alpine AS runner

WORKDIR /app

# Install serve
RUN npm install -g serve

# Copy the built app from the builder
COPY --from=builder /app/dist ./dist

# Expose the port you want to serve on
EXPOSE 3000

# Start the server and serve the Vite-built app
CMD ["serve", "-s", "dist", "-l", "3000"]
