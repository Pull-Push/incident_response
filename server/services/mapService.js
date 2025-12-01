//https://www.google.com/maps/search/?api=1&query=<latitude>,<longitude> PROPER FORMATTING TO SEND TO GOOGLE MAPS


// TO GET LAT / LON info send get request to https://geocoding.geo.census.gov/geocoder/locations/address?street=%{street}&city=${city}&state=${ST}&zip=%{zip}&benchmark=Public_AR_Current&format=json
const axios = require('axios')


async function getLatLon(params) {
    const street = params.addNum.concat(params.street);
    const city = params.city;
    const ST = params.state;
    const zip = params.zip;

    const gridResponse = await axios.get(`https://geocoding.geo.census.gov/geocoder/locations/address?street=${street}&city=${city}&state=${ST}&zip=${zip}&benchmark=Public_AR_Current&format=json`);
    // console.log(gridResponse.data.result.addressMatches[0])
    // console.log('lon', gridResponse.data.result.addressMatches[0].coordinates.x)
    // console.log('lat', gridResponse.data.result.addressMatches[0].coordinates.y)
    const latLongInfo = [gridResponse.data.result.addressMatches[0].coordinates.y, gridResponse.data.result.addressMatches[0].coordinates.x]
    return latLongInfo
}

module.exports = {getLatLon}