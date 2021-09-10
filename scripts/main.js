const baseUrl =
  "https://api.openweathermap.org/data/2.5/weather?units=metric&lang=pt_br";
const apiKey = "d9701d19179eca8fe88710b3f779d3f5";

const card = document.getElementById("weather-card");
const loader = document.getElementById("weather-loader");
const content = document.getElementById("weather-content");
const error = document.getElementById("weather-error");
const coords = document.getElementById("coords");
const tempElement = document.getElementById("temp");
const maxMinTemp = document.getElementById("max-min-temp");
const tempDesc = document.getElementById("temp-desc");
const feelsLike = document.getElementById("feels-like");

document.addEventListener("DOMContentLoaded", function () {
  const { geolocation } = navigator;

  if (geolocation) {
    geolocation.getCurrentPosition(function (pos) {
      /// Executa caso o usuário aceite o GPS
      const { latitude, longitude } = pos.coords;

      fetch(`${baseUrl}&lat=${latitude}&lon=${longitude}&appid=${apiKey}`)
        .then(function (data) {
          return data.json();
        })
        .then(function (data) {
          if (data.cod !== 200) {
            setupErrorContent();
          } else {
            createWeatherContent(data);
          }
        }, setupErrorContent);
    }, setupErrorContent);
  }
});

function setupErrorContent(err) {
  stopLoader();
  error.style.display = "block";
}

function createWeatherContent(weatherData) {
  stopLoader();

  const { temp, temp_max, temp_min, feels_like } = weatherData.main;
  const { lat, lon } = weatherData.coord;
  const { name } = weatherData;

  content.style.display = "flex";
  const spans = coords.getElementsByTagName("span");
  const tempNode = document.createTextNode(`${temp.toFixed(0)}°C`);

  // Setup coords
  spans[0].innerHTML = lat;
  spans[1].innerHTML = lon;
  spans[2].innerHTML = `, ${name}`;

  // Setup current temperature
  tempElement.appendChild(createWeatherIcon(weatherData.weather[0].icon));
  tempElement.appendChild(tempNode);

  // Setup min-max temperatures
  maxMinTemp.innerHTML = `${temp_max.toFixed(1)}°C / ${temp_min.toFixed(1)}°C`;
  feelsLike.innerHTML = `Sensação térmica de ${feels_like.toFixed(1)} °C`;
  tempDesc.innerHTML = weatherData.weather[0].description;
}

function stopLoader() {
  card.classList.remove("with-loader");
  loader.style.display = "none";
}

function startLoader() {
  card.classList.add("with-loader");
  loader.style.display = "";
  error.style.display = "none";
  content.style.display = "none";
}

function createWeatherIcon(code) {
  const icon = document.createElement("img");
  icon.classList.add("weather-icon");
  icon.src = `./assets/icons/${code}.png`;
  icon.style.height = "96px";

  return icon;
}
