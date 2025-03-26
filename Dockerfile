# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container for the backend
WORKDIR /app

# Copy environment variables
COPY .env ./


# Create the backend directory and set it as the working directory
RUN mkdir -p /app/backend
WORKDIR /app/backend

# Copy the backend package.json and package-lock.json
COPY backend/package*.json ./

# Copy the backend server file (Server.js)
COPY backend/Server.js ./

# Install backend dependencies
RUN npm install

# Set the working directory for frontend
WORKDIR /app/frontend

# Copy frontend dependencies and files
COPY frontend/package*.json ./
COPY frontend/script.js ./
COPY frontend/index.html ./
COPY frontend/styles.css ./

# Install frontend dependencies
RUN npm install

# Expose the necessary ports
EXPOSE 3000 8081

# Set working directory back to backend
WORKDIR /app/backend
