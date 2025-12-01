const axios = require('axios')


async function getLocalWeather(foundLocal){
    console.log('weatherService Location', foundLocal)
    const local = []
    let setLoc = {
        lat:'40.948020935058594',
        lon:'-74.05921173095703'
        }
    if(foundLocal){
        setLoc ={
        lat:'36.6441517',
        lon:'-93.2170195'
        }
    }

    // const [lat, lon] = ['34.0194704','-118.491227'] // Santa Monica, CA Test
    const gridResponse = await axios.get(
        `https://api.weather.gov/points/${setLoc.lat},${setLoc.lon}`
    );
    // console.log('grid', gridResponse.data)
    // console.log('forecast URL', gridResponse.data.properties.forecast)
    const localForecast = await axios.get(gridResponse.data.properties.forecast)
    const location  = await axios.get(gridResponse.data.properties.forecastZone)
    // console.log('location', location.data)
    // console.log('forecast data', localForecast.data.properties)
    for(let i=0; i<7; i++){
        local.push(localForecast.data.properties.periods[i])
    }
    const locationInfo = {
        'name': location.data.properties.name,
        'state':location.data.properties.state
    }
    // console.log('forecastHourly', response.data.properties.forecastHourly)

    // GET LOCAL WEATHER
    // GET LOCAL HOURLY
    return {local, locationInfo}
}

module.exports = {getLocalWeather}