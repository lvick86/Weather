# Project Title

A simple web application to monitor Weather of cities with a frontend built using **HTML, CSS, JavaScript** and a backend using **Node.js & Express**.

## Folder Structure
```
Weather/
│── frontend/       # Contains HTML, CSS, and JavaScript files
│── backend/        # Contains Node.js server files
│── README.md       # Project documentation
|── .env            # File to hold Environments Variables (API KEYS etc.). User must create this locally.
```

## Prerequisites
Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v20 or later recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## How to Run the Application
### 1. Clone the Repository
```sh
git clone https://github.com/lvick86/Weather.git
cd your-repo
```

### 2. Create .env file to store API Keys
1. Create a `.env` fil in the root directory
2. Add a variable `GEO_KEY` which should store the `API KEY` for the `GeoCode` API
```sh
GEO_KEY = "<REPLACE_WITH_GEOCODE_API_KEY>"
```
### 3. Start the Backend Server to serve the frontend files + open API connection to fetch weather data.
```sh
cd backend
npm install   # Install dependencies
npm start     # Start the Node.js server
```
By default, the backend runs on **http://localhost:3000**.

---

## API Endpoints
| Method | Endpoint         | Description         |
|--------|----------------|--------------------|
| GET    | `/api/weather?latitude=<value>&longitude=<value>`    | Get the weather data based on `lat` & `long` values |
| GET    | `/api/geocode?city=<city_name>`    | Gets the coordinates of a given city

---
