const inputCity = document.getElementById('city-input');
const searchBtn = document.querySelector('.search-btn');

const apiKey = '6ee3cc2771b56b4688e1e90641011479'

const wetherInfoSection = document.getElementById('weather-info')
const searchCitySection = document.querySelector('.search-city')
const notFoundSection = document.querySelector('.not-found')

const city = document.querySelector('.country-txt')
const currentDate = document.querySelector('.current-date')
const currentTemp = document.querySelector('.temp-txt')
const currentCondition = document.querySelector('.condition-txt')
const currentHumidity = document.querySelector('.humidity-value-txt')
const currentWind = document.querySelector('.wind-value-txt')
const wetherSummaryImage = document.querySelector('.weather-summary-image')

const forcastItemContainer = document.querySelector('.forecast-items-container')

searchBtn.addEventListener('click', () => {
    console.log(inputCity.value);
    if (inputCity.value !== '') {
        getData(inputCity.value)
        getForcastData(inputCity.value)
        inputCity.value = ''
    }
})

inputCity.addEventListener('keydown', (event) => {
    if (event.key == "Enter" && inputCity.value !== '') {
        getData(inputCity.value)
        getForcastData(inputCity.value)
        inputCity.value = ''
    }
})

function getCurrentDate(dt) {
    const timestamp = dt;
    const date = new Date(timestamp * 1000);
    const options = { weekday: 'short', day: '2-digit', month: 'short' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate
}

function getWeatherImage(id) {
    switch (true) {
        case (id <= 232):
            return 'thunderstrom.png'
            break;
        case (id <= 321):
            return 'drizle.png'
            break;
        case (id <= 531):
            return 'rain.png'
            break;
        case (id <= 622):
            return 'snow.png'
            break;
        case (id <= 781):
            return 'mist.png'
            break;
        default:
            return 'cloud.png'
    }
}


const getData = async (place) => {
    let result = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apiKey}`)
    let response = await result.json();
    if (response.cod >= 200 && response.cod < 300) {
        showDisplaySection(wetherInfoSection)
        wetherSummaryImage.src = `./images/${getWeatherImage(response.weather[0].id)}`
        city.textContent = response.name
        currentDate.textContent = getCurrentDate(response.dt)
        currentTemp.textContent = Math.floor((response.main.temp) - 273.15) + " ℃"
        currentCondition.textContent = response.weather[0].main
        currentHumidity.textContent = response.main.humidity + "%"
        currentWind.textContent = Math.floor(response.wind.speed) + " Km/h"
    } else {
        showDisplaySection(notFoundSection)
    }
}

const getForcastData = async (place) => {
    let result = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${apiKey}`)
    let response = await result.json();
    let hourlyData = response.list.slice(0, 12); // Next 12 hours
    console.log(hourlyData);
    forcastItemContainer.innerHTML = ''

    hourlyData.forEach(hour => {
        const time = new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const temp = (hour.main.temp - 273.15).toFixed(1); // Convert Kelvin to Celsius
        const weather = hour.weather[0].main;
        const icon = hour.weather[0].id

        forcastItemContainer.innerHTML += `
            <div class="forecast-item">
                    <h1 class="forecast-item-date regular-txt">${time}</h1>
                    <img src="./images/${getWeatherImage(icon)}" alt="" class="forecast-item-img">
                    <h5 class="forecast-item-temp">${temp} ℃</h5>
                </div>
        `

    });
}

function showDisplaySection(section) {
    [wetherInfoSection, searchCitySection, notFoundSection].forEach(section => section.style.display = 'none')
    section.style.display = "flex"
}