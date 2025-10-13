//Air quality index
    const apiKey = 'e8d83feabbee14a0c1323f56e4c48145';// <-- Replace with your OpenWeatherMap API key
    const lat = 25.585407; // Your location
    const lon = 85.187736;

    function getAQIDescription(lat, lon, apiKey) {
      const url = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
      const aqiLabels = ["Good", "Fair", "Moderate", "Poor", "Very Poor"];

      return fetch(url)
        .then(response => response.json())
        .then(data => {
          if (!data.list || data.list.length === 0) {
            throw new Error("No AQI data available");
          }

          const aqi = data.list[0].main.aqi; // 1 to 5
          return {
            label: aqiLabels[aqi - 1],
            value: aqi
          };
        })
        .catch(error => {
          console.error("Error fetching AQI:", error.message);
          return null;
        });
    }

    function getBootstrapAlertClass(aqiValue) {
      if (aqiValue <= 2) return 'alert-success';    // Good or Fair
      if (aqiValue === 3) return 'alert-warning';   // Moderate
      if (aqiValue >= 4) return 'alert-danger';     // Poor or Very Poor
    }

    window.addEventListener('load', () => {
      setTimeout(() => {
        getAQIDescription(lat, lon, apiKey).then(aqi => {
          const alertBox = document.getElementById('aqi-alert');

          if (aqi) {
            const alertClass = getBootstrapAlertClass(aqi.value);
            alertBox.className = `alert ${alertClass}`;
            alertBox.innerHTML = `
              <strong>Air Quality Alert:</strong> The air quality is <strong>${aqi.label}</strong>. Please take precautions.
            `;
            alertBox.style.display = 'block';
          } else {
            alertBox.className = 'alert alert-secondary';
            alertBox.innerHTML = 'Could not retrieve air quality data.';
            alertBox.style.display = 'block';
          }
        });
      }, 10000); // Show alert after 10 seconds
    });
