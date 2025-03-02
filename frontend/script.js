document.addEventListener("DOMContentLoaded", () => {
  const weatherInfo = document.getElementById("weather-info");
  const refreshButton = document.getElementById("refresh-btn");
  const selectCity = document.getElementById("location-select");
  const geoCoords = document.getElementById("geo-coords");
  const dogImage = document.getElementById("dog-image");
  const refreshDog = document.getElementById("refresh-dog");
  const windDirectionElement = document.getElementById("wind-direction");
  const tempValueElement = document.getElementById("temp-value");
  const windSpeedElement = document.getElementById("wind-speed");
  const weatherCodeElement = document.getElementById("weathercode");

  // Fetch random dog image
  async function fetchDog() {
    try {
      const response = await fetch(`/api/dog`);
      const data = await response.json();
      dogImage.src = data;
    } catch (error) {
      console.error("Error fetching dog image:", error);
      dogImage.innerHTML = "<p>Error fetching dog image. Please try again later.</p>";
    }
  }

  // Fetch geo coordinates for selected city
  async function fetchGeo() {
    const city = selectCity.value;
    if (!city) {
      geoCoords.innerHTML = "<p>Please select a city.</p>";
      return;
    }

    try {
      const response = await fetch(`/api/geocode?city=${city}`);
      const data = await response.json();
      geoCoords.innerHTML = `Latitude: ${data.latitude.toFixed(2)} | Longitude: ${data.longitude.toFixed(2)}`;
      fetchWeatherData(data.latitude, data.longitude);
    } catch (error) {
      console.error("Error fetching geo coordinates:", error);
      geoCoords.innerHTML = "<p>Error fetching data. Please try again later.</p>";
    }
  }

  // Fetch weather data based on geo coordinates
  async function fetchWeatherData(latitude, longitude) {
    try {
      const response = await fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}`);
      const data = await response.json();
      
      // Extract weather data
      const temperature = data.temperature.toFixed(2);
      const windSpeed = data.windspeed.toFixed(2);
      const windDirection = data.winddirection;
      const weathercode = data.weathercode;

      // Update weather info
      tempValueElement.textContent = `${temperature}°F`;
      windSpeedElement.textContent = `${windSpeed} m/s`;
      const weatherDescription = getWeatherDescription(weathercode);
      weatherCodeElement.textContent = weatherDescription;

      // Set the wind direction
      setWindDirection(windDirection);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      weatherInfo.innerHTML = "<p>Error fetching weather data. Please try again later.</p>";
    }
  }

  // Function to set the wind direction as text
  function setWindDirection(degrees) {
    let direction = '';
    if (degrees >= 348.75 || degrees < 11.25) direction = 'North';
    else if (degrees >= 11.25 && degrees < 33.75) direction = 'North-Northeast';
    else if (degrees >= 33.75 && degrees < 56.25) direction = 'Northeast';
    else if (degrees >= 56.25 && degrees < 78.75) direction = 'East-Northeast';
    else if (degrees >= 78.75 && degrees < 101.25) direction = 'East';
    else if (degrees >= 101.25 && degrees < 123.75) direction = 'Southeast';
    else if (degrees >= 123.75 && degrees < 146.25) direction = 'South';
    else if (degrees >= 146.25 && degrees < 168.75) direction = 'Southwest';
    else if (degrees >= 168.75 && degrees < 191.25) direction = 'West';
    else if (degrees >= 191.25 && degrees < 213.75) direction = 'Northwest';
    else if (degrees >= 213.75 && degrees < 236.25) direction = 'West';
    else if (degrees >= 236.25 && degrees < 258.75) direction = 'West-Southwest';
    else if (degrees >= 258.75 && degrees < 281.25) direction = 'Southwest';
    else if (degrees >= 281.25 && degrees < 303.75) direction = 'West-Southwest';
    else if (degrees >= 303.75 && degrees < 326.25) direction = 'West';
    else if (degrees >= 326.25 && degrees < 348.75) direction = 'Northwest';
    windDirectionElement.textContent = direction;
  }

  // Weather descriptions based on weathercode
  function getWeatherDescription(weathercode) {
    switch (weathercode) {
      case 0:
        return "Clear sky";
      case 1:
        return "Mainly clear";
      case 2:
        return "Partly cloudy";
      case 3:
        return "Cloudy";
      case 4:
        return "Overcast";
      case 5:
        return "Fog";
      case 6:
        return "Light rain showers";
      case 7:
        return "Moderate rain showers";
      case 8:
        return "Heavy rain showers";
      case 9:
        return "Thunderstorms";
      case 10:
        return "Light rain";
      case 11:
        return "Moderate rain";
      case 12:
        return "Heavy rain";
      case 13:
        return "Light snow showers";
      case 14:
        return "Moderate snow showers";
      case 15:
        return "Heavy snow showers";
      case 16:
        return "Light snow";
      case 17:
        return "Moderate snow";
      case 18:
        return "Heavy snow";
      case 19:
        return "Sleet";
      case 20:
        return "Light hail";
      case 21:
        return "Moderate hail";
      case 22:
        return "Heavy hail";
      case 23:
        return "Thunderstorms with light rain";
      case 24:
        return "Thunderstorms with moderate rain";
      case 25:
        return "Thunderstorms with heavy rain";
      case 26:
        return "Thunderstorms with light snow";
      case 27:
        return "Thunderstorms with moderate snow";
      case 28:
        return "Thunderstorms with heavy snow";
      default:
        return "Unknown weather condition";
    }
  }

  // Refresh weather data when the button is clicked
  refreshButton.addEventListener("click", fetchGeo);
  refreshDog.addEventListener("click", fetchDog);

  // Save city selection in localStorage
  function saveSelection() {
    const userSelection = selectCity.value;
    localStorage.setItem("userSelection", userSelection);
  }

  // Restore the city selection from localStorage
  const savedSelection = localStorage.getItem("userSelection");
  if (savedSelection) {
    selectCity.value = savedSelection;
    fetchGeo();
  }

  // Save the city selection whenever it changes
  selectCity.addEventListener("change", () => {
    saveSelection();
    fetchGeo();
  });

  // Fetch a dog image on page load
  fetchDog();

  // Set up auto-refresh for weather every 10 minutes (10000 * 5 * 60)
  setInterval(() => {
    if (selectCity.value) {
      fetchGeo();
    }
  }, 10000 * 5 * 60); // 10 minutes (corrected)

  // Set up auto-refresh for dog image every 10 seconds (1000 * 10)
  setInterval(fetchDog, 1000 * 10); // 10 seconds
});
