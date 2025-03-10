const express = require("express");
const path = require("path");
const axios = require("axios");
const cors = require("cors");
const http = require("http"); // Required for WebSocket
const WebSocket = require("ws"); // WebSocket server

require("dotenv").config({ path: "../.env" });

const app = express();
const port = process.env.PORT || 3000;
const server = http.createServer(app); // Create an HTTP server for WebSocket
const wss = new WebSocket.Server({ server });

let lastFrame = null; // Store the latest ESP32-CAM image

// Middleware
const rateLimit = require("express-rate-limit");
// Rate limit: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10000, // Limit each IP to 100 requests per window
    message: "Too many requests, please try again later.",
  });
  
  app.use(limiter);
  // Enable CORS middle
app.use(cors());
app.use(express.json());

// API keys & URLs
const geoURL = "https://api.opencagedata.com/geocode/v1/json";
const geoKEY = process.env.GEO_KEY;
const dogURL = "https://dog.ceo/api/breeds/image/random";
const BASE_URL = "https://api.open-meteo.com/v1/forecast";



// **Existing API Routes**
// Fetch random dog image
app.get("/api/dog", async (req, res) => {
    try {
        console.log('Dog image requested')
        const response = await axios.get(dogURL);
        return res.json(response.data.message);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch Image." });
    }
});

// Geocode API - Get latitude & longitude of a city
app.get("/api/geocode", async (req, res) => {
    const city = req.query.city;

    if (!city) {
        return res.status(400).json({ error: "City name is required." });
    }

    try {
        const geoUrl = `${geoURL}?q=${city}&key=${geoKEY}`;
        const response = await axios.get(geoUrl);

        if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            return res.json({ latitude: lat, longitude: lng });
        } else {
            return res.status(404).json({ error: "City not found." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch coordinates." });
    }
});

// Weather API - Fetch weather data for given coordinates
app.get("/api/weather", async (req, res) => {
    const { latitude, longitude } = req.query;
    console.log(`Weather request: lat=${latitude}, lon=${longitude}`);

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                latitude: latitude,
                longitude: longitude,
                current_weather: true
            }
        });

        if (!response.data || !response.data.current_weather) {
            return res.status(500).json({ error: "Error fetching data from Open-Meteo" });
        }

        const weatherData = {
            temperature: (response.data.current_weather.temperature * 9) / 5 + 32, // Celsius to Fahrenheit
            windspeed: response.data.current_weather.windspeed,
            winddirection: response.data.current_weather.winddirection,
            weathercode: response.data.current_weather.weathercode
        };

        res.json(weatherData);
    } catch (error) {
        console.error("Error fetching weather data: ", error);
        res.status(500).json({ error: "Failed to fetch weather data" });
    }
});

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../frontend")));

// Catch-all route for frontend
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// Start the server
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
