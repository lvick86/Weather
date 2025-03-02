// public/script.js
document.addEventListener("DOMContentLoaded", () => {
  const weatherInfo = document.getElementById("weather-info");
  const refreshButton = document.getElementById("refresh-btn");
  const selectCity = document.getElementById("location-select");
  const geoCoords = document.getElementById("geo-coords");
  const dogImage = document.getElementById("dog-image");
  const refreshDog = document.getElementById("refresh-dog");

  // Fetch dog image
  async function fetchDog() {
    try {
      const response = await fetch(`/api/dog`);
      const data = await response.json();
      dogImage.src = data;
    } catch (error) {
      console.error("Error fetching dog image:", error);
      dogImage.innerHTML = "<p>Error fetching data. Please try again later.</p>";
    }
  }

  // Fetch geo coordinates for selected city
  async function fetchGeo() {
    const city = selectCity.value; // Get the selected city
    if (!city) {
      geoCoords.innerHTML = "<p>Please select a city</p>";
      return;
    }
    try {
      const response = await fetch(`/api/geocode?city=${city}`);
      const data = await response.json();
      geoCoords.innerHTML =
        "Latitude: " + data.latitude.toFixed(2) + " Longitude: " + data.longitude.toFixed(2);
      fetchWeatherData(data.latitude, data.longitude);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      geoCoords.innerHTML = "<p>Error fetching data. Please try again later.</p>";
    }
  }

  // Fetch weather data based on geo coordinates
  async function fetchWeatherData(latitude, longitude) {
    try {
      const timestamp = new Date().getTime();
      if (isNaN(latitude) || isNaN(longitude)) {
        console.error("Invalid lat or long");
        return;
      }
      const response = await fetch(
        `/api/weather?latitude=${latitude}&longitude=${longitude}&timestamp=${timestamp}`
      );
      const data = await response.json();
      weatherInfo.innerHTML = `
          <p>Temperature: ${data.temperature.toFixed(2)}°F</p>
          <p>Windspeed: ${data.windspeed.toFixed(2)}</p>
        `;
      console.log("Weather data refreshed");
    } catch (error) {
      console.error("Error fetching weather data:", error);
      weatherInfo.innerHTML = "<p>Error fetching data. Please try again later.</p>";
    }
  }

  // Save selected city to localStorage
  function saveSelection() {
    const userSelection = selectCity.value;
    localStorage.setItem("userSelection", userSelection);
  }

  // Refresh the weather data when the button is clicked
  refreshButton.addEventListener("click", fetchGeo);
  refreshDog.addEventListener("click", fetchDog);

  // Restore previous city selection from localStorage
  const savedSelection = localStorage.getItem("userSelection");
  if (savedSelection) {
    selectCity.value = savedSelection; // Restore the selection
    fetchGeo(); // Fetch geo and weather data for the saved city
  }

  // Save selection whenever the user changes the city
  selectCity.addEventListener("change", () => {
    saveSelection();
    fetchGeo();
  });

  // Fetch the dog image on page load
  fetchDog();

  // Function to refresh the weather and geo data
  function refreshWeatherData() {
    const city = selectCity.value; // Get the selected city
    if (city) {
      fetchGeo(); // Refresh weather and geo data for the selected city
    }
  }

  // Function to refresh the dog image
  function refreshDogImage() {
    fetchDog(); // Refresh dog image
  }

  // Call refreshWeatherData every 5 seconds (for weather and geo data)
  setInterval(refreshWeatherData, 10*60*1000);

  // Call refreshDogImage every 10 seconds (for dog image)
  setInterval(refreshDogImage, 15*1000);
});
