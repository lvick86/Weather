// public/script.js
document.addEventListener("DOMContentLoaded", () => {
    const weatherInfo = document.getElementById("weather-info");
    const refreshButton = document.getElementById("refresh-btn");
    const selectCity = document.getElementById("location-select")
    const geoCoords = document.getElementById('geo-coords')

    async function fetchGeo(){
        const city = document.getElementById('location-select').value;  // Get the selected city
        try {
            console.log(city)
            const response = await fetch(`/api/geocode?city=${city}`);
            const data = await response.json();
            console.log(data)
            geoCoords.innerHTML = "Latitude: "+data.latitude + " Longitude: "+data.longitude
            fetchWeatherData(data.latitude,data.longitude)
          } catch (error) {
            console.error("Error fetching weather data:", error);
            geoCoords.innerHTML = "<p>Error fetching data. Please try again later.</p>";
          }
    }
    async function fetchWeatherData(latitude,longitude) {
      try {
        console.log(latitude)
        console.log(longitude)
        const timestamp = new Date().getTime()
        if (isNaN(latitude) || isNaN(longitude)){
            console.error("Invalid lat or long");
            return;
        }
        const response = await fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}&timestamp=${timestamp}`);
        const data = await response.json();
        weatherInfo.innerHTML = `
          <p>Temperature: ${data.temperature}°F</p>
          <p>Windspeed: ${data.windspeed}%</p>
        `;
        console.log("Data refreshed")
      } catch (error) {
        console.error("Error fetching weather data:", error);
        weatherInfo.innerHTML = "<p>Error fetching data. Please try again later.</p>";
      }
    }
  

    // Refresh the weather data when the button is clicked
    refreshButton.addEventListener("click",fetchGeo);
    selectCity.addEventListener("change", fetchGeo);
  });
  