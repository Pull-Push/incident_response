const axios = require('axios')


async function getLocalWeather(){
    const [lat, lon] = ['40.948020935058594','-74.05921173095703']
    const response = await axios.get(
        `http://api.weather.gov/points/${lat},${lon}`
    );
    console.log('weather service', response)
    console.log('data', response.data)
    console.log('forecast URL', response.data.properties.forecast)
    console.log('forecastHourly', response.data.properties.forecastHourly)

    // GET LOCAL WEATHER
    // GET LOCAL HOURLY
    return response.data
}

module.exports = {getLocalWeather}