const apiKey = import.meta.env.VITE_OPEN_WEATHER_API_KEY;

export default class Weather {
    constructor({ lat, lng }) {

        this.urlWeather = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
        this.urlForecast = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lng}&units=metric&appid=${apiKey}`;
    }

    init() {
        this.getWeatherData();
        this.getForecastData();
    }

    async getWeatherData() {
        const response = await fetch(this.urlWeather);
        const data = await response.json();

        displayWeatherData(data);
    }

    async getForecastData() {
        const response = await fetch(this.urlForecast);
        const data = await response.json();


        displayForecastData(data);
    }
}


function displayWeatherData(data) {

    const weatherInfo = document.getElementById('weather-info');

    const temperature = Math.floor(data.main.temp);
    const feelsLike = Math.floor(data.main.feels_like);
    const description = data.weather[0].description;
    const high = Math.floor(data.main.temp_max);
    const low = Math.floor(data.main.temp_min);
    const humidity = data.main.humidity;
    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', {
        timeZone: 'America/Lima',
        hour: '2-digit',
        minute: '2-digit'
    });
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', {
        timeZone: 'America/Lima',
        hour: '2-digit',
        minute: '2-digit'
    });
    const icon = data.weather[0].icon;

    // Limpiar contenido anterior y renderizar nuevo contenido
    weatherInfo.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${icon}@4x.png" alt="${description}" width="100px" height="100px">
        <div>
            <p><strong>Temperature:</strong> ${temperature} °C</p>
            <p><strong>Feels Like:</strong> ${feelsLike} °C</p>
            <p><strong>Description:</strong> ${description}</p>
            <p><strong>High:</strong> ${high} °C</p>
            <p><strong>Low:</strong> ${low} °C</p>
            <p><strong>Humidity:</strong> ${humidity} %</p>
            <p><strong>Sunrise:</strong> ${sunrise}</p>
            <p><strong>Sunset:</strong> ${sunset}</p>
        </div>
    `;
}

function displayForecastData(data) {
    const forecastContainer = document.getElementById('forecast-info');

    forecastContainer.innerHTML = ""; // Limpiar el contenedor

    const forecastList = data.list;
    const forecastDaily = forecastList.filter((item, index) => index % 8 === 0);
    const forecast = forecastDaily.slice(0, 5);

    // Construir el bloque HTML con template literals
    const forecastHTML = forecast.map(item => {
        const day = new Date(item.dt_txt).toLocaleDateString('en-US', { weekday: 'long' });
        const temp = Math.floor(item.main.temp);
        return `<p><strong>${day}:</strong> ${temp} °C</p>`;
    }).join('');

    // Insertar en el DOM
    forecastContainer.innerHTML = forecastHTML;


}