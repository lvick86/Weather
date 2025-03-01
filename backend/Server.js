// server.js
const express = require('express');
const path = require('path');
const axios = require('axios');
const cors = require('cors');  // Import CORS

// Load the env variables from .env file
require('dotenv').config({ path: '../.env' });
const app = express();
const port = process.env.PORT || 3000;

// OpenCage Geocoding API key and URL
const geoURL = "https://api.opencagedata.com/geocode/v1/json";
const geoKEY = process.env.GEO_KEY;  // Ensure the correct API key is used

// Weather API URL for Open-Meteo
const BASE_URL = 'https://api.open-meteo.com/v1/forecast'; 

const rateLimit = require('express-rate-limit');
// Rate limit: max 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  message: 'Too many requests, please try again later.',
});

app.use(limiter);
// Enable CORS middleware
app.use(cors());

// Middleware to handle JSON requests
app.use(express.json());

// Route to get coordinates for a city
app.get('/api/geocode', async (req, res) => {
  const city = req.query.city;

  if (!city) {
    return res.status(400).json({ error: 'City name is required.' });
  }

  try {
    // Fetch coordinates for the city from OpenCage
    const geoUrl = `${geoURL}?q=${city}&key=${geoKEY}`;
    const response = await axios.get(geoUrl);

    if (response.data.results.length > 0) {
      const { lat, lng } = response.data.results[0].geometry;
      return res.json({ latitude: lat, longitude: lng });
    } else {
      return res.status(404).json({ error: 'City not found.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch coordinates.' });
  }
});

// API route to get weather data based on dynamic coordinates
app.get('/api/weather', async (req, res) => {
  const { latitude, longitude } = req.query;  // Get latitude and longitude from the request query
  console.log(latitude)
  console.log(longitude)
  console.log("Backend Request")
  try {
    // Make the API request to Open-Meteo to get weather data
    const response = await axios.get(BASE_URL, {
      params: {
        latitude: latitude,
        longitude: longitude,
        current_weather: true,  // Request current weather data
      },
    });

    const data = response.data;

    if (!data || !data.current_weather) {
      return res.status(500).json({ error: 'Error fetching data from Open-Meteo' });
    }

    console.log(data.current_weather)
    const weatherData = {
      temperature: data.current_weather.temperature * 9 / 5 + 32,  // Convert from Celsius to Fahrenheit
      windspeed: data.current_weather.windspeed,
    };

    res.json(weatherData);  // Send the weather data as a JSON response
  } catch (error) {
    console.error("Error fetching weather data: ", error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// Serve static files from the 'frontend' folder.
app.use(express.static(path.join(__dirname, '../frontend')));

// For all other requests, serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

// Start the backend server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
