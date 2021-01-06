const apiKey = "101cb381c5c03577279072c4e7591cf1";
const baseURL = "http://api.openweathermap.org/data/2.5/";
const imgBaseURL = "http://openweathermap.org/img/wn/";
const currentConditions = document.querySelector('.current-conditions');
const forecast = document.querySelector('.forecast');

//obtain the current weather condition using location
function getCurrentCondition(latitude, longitude) {
  return fetch(`${baseURL}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
    .then(Response => {
      return Response.json();
    })
}

//obtain 5 day forecast for that region 
function get5DaysForecast(latitude, longitude) {
  return fetch(`${baseURL}forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`)
    .then(Response => {
      return Response.json();
    })
}

//obtain the user's current location
navigator.geolocation.getCurrentPosition((position) => {
  getWeather(position.coords.latitude, position.coords.longitude);
});

//get current and forecast weather details for next 5 days of user's location
function getWeather(latitude, longitude) {
  getCurrentCondition(latitude, longitude)
    .then(json => {
      currentConditions.innerHTML = "";
      let icon = json.weather[0].icon;
      let temp = json.main.temp;
      let description = json.weather[0].description;
      insertCurrentConditionToHTML(icon, temp, description);

      get5DaysForecast(latitude, longitude)
        .then(json => {
          let list = [];
          while (json.list.length > 0) {
            list.push(json.list.splice(0, 8));
          }
          forecast.innerHTML = "";

          list.forEach(day => {
            findPropertiesforEachDay(day);
          });
        })
    })
}

//find weather details for next 5 days 
function findPropertiesforEachDay(day) {
  let date = new Date(day[4].dt_txt);
  let weekday = date.toLocaleDateString('en-US', { weekday: 'long' });
  let icon = day[5].weather[0].icon;
  let description = day[5].weather[0].description;
  let tempMin = [];
  let tempMax = [];

  day.forEach(hour => {
    tempMax.push(hour.main.temp_max);
    tempMin.push(hour.main.temp_min);
  });
  let high = Math.ceil(Math.max(...tempMax));
  let low = Math.ceil(Math.min(...tempMin));
  insertWeatherForcastToHTML(weekday, icon, description, high, low);
}

//display today's weather conditions on the screen
function insertCurrentConditionToHTML(icon, temperature, currentCondition) {
  currentConditions.insertAdjacentHTML('beforeend',
    `<h2>Current Conditions</h2>
      <img src="${imgBaseURL}${icon}@2x.png" />
      <div class="current">
        <div class="temp">${temperature}℃</div>
        <div class="condition">${currentCondition}</div>
      </div>
    `)
}

//display weather forcast details of next 5 days on the screen
function insertWeatherForcastToHTML(weekday, icon, description, high, low) {
  forecast.insertAdjacentHTML('beforeend',
    `<div class="day">
        <h3>${weekday}</h3>
        <img src="${imgBaseURL}${icon}@2x.png" />
        <div class="description">${description}</div>
        <div class="temp">
          <span class="high">${high}℃</span>/<span class="low">${low}℃</span>
        </div>
      </div>
  `)
}
