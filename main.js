const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
}

const searchbox = document.querySelector('.search-box');
const searchbtn = document.querySelector('.search-btn');

searchbox.addEventListener('keypress', setQuery);
searchbtn.addEventListener('click', () => getResults(searchbox.value));

// Set initial city
getResults("Ahmedabad");

function setQuery(evt) {
  if (evt.keyCode === 13) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  if (!query) query = "Ahmedabad";
  
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(weather => {
      displayResults(weather);
    })
    .catch(error => {
      alert(error.message);
      console.error('Error:', error);
    });
}

function displayResults(weather) {
  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = formatDate(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather span');
  weather_el.innerText = weather.weather[0].main;
  
  // Update weather icon
  const weatherIcon = document.querySelector('.current .weather i');
  weatherIcon.className = getWeatherIcon(weather.weather[0].id);

  let hilow = document.querySelector('.hi-low');
  hilow.innerHTML = `
    <span><i class="fas fa-temperature-arrow-up"></i> ${Math.round(weather.main.temp_max)}°c</span>
    <span><i class="fas fa-temperature-arrow-down"></i> ${Math.round(weather.main.temp_min)}°c</span>
  `;
  
  // Update additional info
  document.querySelector('.additional-info .info-item:nth-child(1) span').textContent = 
    `${Math.round(weather.wind.speed)} km/h`;
    
  document.querySelector('.additional-info .info-item:nth-child(2) span').textContent = 
    `${weather.main.humidity}%`;
}

function formatDate(d) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return d.toLocaleDateString('en-US', options);
}

function getWeatherIcon(weatherId) {
  if (weatherId >= 200 && weatherId < 300) {
    return 'fas fa-bolt'; // Thunderstorm
  } else if (weatherId >= 300 && weatherId < 400) {
    return 'fas fa-cloud-rain'; // Drizzle
  } else if (weatherId >= 500 && weatherId < 600) {
    return 'fas fa-cloud-showers-heavy'; // Rain
  } else if (weatherId >= 600 && weatherId < 700) {
    return 'fas fa-snowflake'; // Snow
  } else if (weatherId >= 700 && weatherId < 800) {
    return 'fas fa-smog'; // Atmosphere
  } else if (weatherId === 800) {
    return 'fas fa-sun'; // Clear
  } else {
    return 'fas fa-cloud'; // Clouds
  }
}

// Initialize with current date
document.querySelector('.location .date').textContent = formatDate(new Date());