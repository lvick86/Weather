# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json (or npm-shrinkwrap.json)
# This is done to install dependencies first and avoid re-installing on every build
COPY backend/package.json ./backend
COPY backend/Server.js ./backend

COPY frontend/package.json ./frontend
COPY frontend/script.js ./frontend
COPY frontend/index.html ./frontend
COPY frontend/style.css ./frontend

# Install dependencies
RUN npm install


# Expose the port the app runs on
EXPOSE 3000

WORKDIR /app/backend
# Command to run the server
CMD ["npm", "start"]
