const search = document.querySelector(".search button");
const searchBox = document.querySelector(".search");
const weatherBox = document.querySelector(".weather-box");
const weatherDetails = document.querySelector(".weather-details");
const error = document.querySelector(".error");
const errorIcon = document.getElementById("errorIcon");
const results = document.querySelector(".results");
const background = document.querySelector(".background");
const fullBackground = document.querySelector(".full-background");
const cursor = document.querySelector(".custom-cursor");
let userInput = document.getElementById("inputText");

let errorcheck = 0;

function zeroCorrector(value) {
  if (value < 10) {
    return value.toString().padStart(2, "0");
  }

  return value;
}

window.addEventListener("mousemove", (e) => {
  cursor.style.display = "block";
  cursor.style.left = e.clientX - 12 + "px";
  cursor.style.top = e.clientY - 12 + "px";
});

window.addEventListener("mouseout", () => {
  cursor.style.display = "none";
});

search.addEventListener("click", () => {
  getAPIData();
  userInput.value = "";
});

userInput.addEventListener("keypress", (trigger) => {
  if (trigger.key === "Enter") {
    getAPIData();
    userInput.value = "";
  }
});

function getAPIData() {
  const APIKey = "OPEN_WEATHER_API_KEY";
  const city = document.querySelector(".search input").value;
  const image = document.querySelector(".weather-box img");

  if (city === "") return;

  fetch(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`
  )
    .then((response) => response.json())
    .then((json) => {
      if (json.cod == "404") {
        console.log(errorcheck);
        if (errorcheck === 2) {
          background.style.animation = "none";
        }
        errorcheck = 1;
        fullBackground.style.display = "none";
        results.style.display = "none";
        background.style.display = "block";
        error.style.display = "flex";
        searchBox.style.border = "1px solid rgb(227,0,0)";
        errorIcon.style.display = "inline";
      } else {
        errorcheck = 2;
        results.style.display = "grid";
        error.style.display = "none";
        errorIcon.style.display = "none";
        searchBox.style.border = "1px solid #ebebeb";

        const temperature = document.querySelector(".weather-box .temp");
        const description = document.querySelector(".weather-box .description");
        const humidity = document.querySelector("#humidityValue");
        const wind = document.querySelector("#windValue");
        const visibility = document.querySelector("#visibilityValue");
        const pressure = document.querySelector("#pressureValue");
        const minTemperature = document.querySelector("#minTempValue");
        const maxTemperature = document.querySelector("#maxTempValue");
        const feelsLike = document.querySelector("#feelsLikeValue");
        const airQuality = document.querySelector("#airQualityValue");
        const sunrise = document.querySelector("#sunriseTime");
        const sunset = document.querySelector("#sunsetTime");

        var latitude = json.coord.lat;
        var longitude = json.coord.lon;

        const sunriseTime = json.sys.sunrise;
        const sunsetTime = json.sys.sunset;
        const sunriseDate = new Date(
          (sunriseTime + json.timezone) * 1000
        ).toUTCString();
        const sunsetDate = new Date(
          (sunsetTime + json.timezone) * 1000
        ).toUTCString();

        var sunsetHour =
          new Date(sunsetDate).getUTCHours() > 12
            ? new Date(sunsetDate).getUTCHours() - 12
            : new Date(sunsetDate).getUTCHours();

        switch (json.weather[0].main) {
          case "Clear":
            image.src = "icons/Clear-Sky.png";
            break;

          case "Clouds":
            image.src = json.weather[0].description.startsWith("f")
              ? "icons/Few-Clouds.png"
              : "icons/Scattered-Clouds.png";
            break;

          case "Thunderstorm":
            image.src =
              json.weather[0].description.includes("rain") ||
              json.weather[0].description.includes("drizzle")
                ? "icons/Thunderstorm-Rain.png"
                : "icons/Thunderstorm.png";
            break;

          case "Drizzle":
            image.src = json.weather[0].description.startsWith("l")
              ? "icons/Light-Drizzle.png"
              : "icons/Heavy-Drizzle.png";
            break;

          case "Rain":
            switch (json.weather[0].description) {
              case "light rain":
                image.src = "icons/Light-Rain.png";
                break;
              case "freezing rain":
                image.src = "icons/Freezing-Rain.png";
              default:
                image.src = "icons/Rain.png";
            }
            break;

          case "Snow":
            if (json.weather[0].description === "light snow")
              image.src = "icons/Light-Snow.png";
            else if (
              json.son.weather[0].description.includes("rain") ||
              (json.son.weather[0].description.includes("shower") &&
                !json.son.weather[0].description.includes("sleet"))
            )
              image.src = "icons/Rain-Snow.png";
            else image.src = "icons/Snow.png";
            break;

          default:
            image.src = "";
            break;
        }

        if (json.weather[0].id.toString().startsWith("7"))
          image.src = "icons/Wind.png";

        // image.classList.add("night");

        document.getElementById("cityName").innerHTML = json.name;
        temperature.innerHTML = `${parseInt(json.main.temp)}<span>°C</span>`;
        description.innerHTML = `${json.weather[0].description.toUpperCase()}`;
        humidity.innerHTML = `${json.main.humidity}%`;
        wind.innerHTML = `${parseInt(json.wind.speed)}<p>Km/h</p>`;
        visibility.innerHTML = `${parseInt(json.visibility) / 1000} Km`;
        pressure.innerHTML = `${parseInt(json.main.pressure)}<p>hPa</p>`;
        minTemperature.innerHTML = `${parseInt(
          json.main.temp_min
        )}<span>°C</span>`;
        maxTemperature.innerHTML = `${parseInt(
          json.main.temp_max
        )}<span>°C</span>`;
        feelsLike.innerHTML = `${parseInt(
          json.main.feels_like
        )}<span>°C</span>`;

        sunrise.innerHTML = `${zeroCorrector(
          new Date(sunriseDate).getUTCHours()
        )}:${zeroCorrector(new Date(sunriseDate).getUTCMinutes())}AM`;
        sunset.innerHTML = `${zeroCorrector(sunsetHour)}:${zeroCorrector(
          new Date(sunsetDate).getUTCMinutes()
        )}PM`;

        fetch(
          `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${APIKey}`
        )
          .then((res) => res.json())
          .then((json) => {
            airQuality.innerHTML = `${json.list[0].main.aqi}`;
          });

        window.scrollTo(0, document.body.scrollHeight);
        background.style.display = "none";
        fullBackground.style.display = "block";
      }
    });
}
