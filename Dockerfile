# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container for the backend
WORKDIR /app

COPY .env ./

# Create the backend directory (if it doesn't exist) and set it as the working directory
RUN mkdir -p /app/backend
WORKDIR /app/backend

# Copy the backend package.json and package-lock.json (or npm-shrinkwrap.json)
COPY backend/package*.json ./

# Copy the backend server file (Server.js)
COPY backend/Server.js ./

# Install backend dependencies
RUN npm install

# Set the working directory for frontend
WORKDIR /app/frontend

# Create the frontend directory (if it doesn't exist) and set it as the working directory
RUN mkdir -p /app/frontend
COPY frontend/package*.json ./

# Copy frontend files (JS, HTML, CSS)
COPY frontend/script.js ./
COPY frontend/index.html ./
COPY frontend/styles.css ./

# Install frontend dependencies
RUN npm install

# Expose the port the app runs on
EXPOSE 3000

# Set working directory back to backend for the final command
WORKDIR /app/backend

# Command to run the backend server
CMD ["npm", "start"]
