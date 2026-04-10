//https://www.google.com/maps/search/?api=1&query=<latitude>,<longitude> PROPER FORMATTING TO SEND TO GOOGLE MAPS
// https://www.google.com/maps/search/?api=1&query=40.743938707339,-74.001222541734

// https://geocoding.geo.census.gov/geocoder/locations/address?street=${1260 6th Ave}&city=${New York}&state=${NY}&zip=${10020}&benchmark=Public_AR_Current&format=json
// https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?address=38%20Grant%20Ave%2C%20Pompton%20Lakes%2C%20NJ%2007442&benchmark=4
// https://geocoding.geo.census.gov/geocoder/locations/address?street=38%20Grant%20Street&city=Pompton%20Lakes&state=NJ&zip=07442&benchmark=4



// TO GET LAT / LON info send get request to https://geocoding.geo.census.gov/geocoder/locations/address?street=%{street}&city=${city}&state=${ST}&zip=%{zip}&benchmark=Public_AR_Current&format=json
const axios = require('axios')


async function getLatLon(params) {
    console.log(params)

    const address = params.address;
    const city = params.city;
    const ST = params.state;
    const zip = params.zip;

    const gridResponse = await axios.get(`https://geocoding.geo.census.gov/geocoder/locations/address?street=${address}&city=${city}&state=${ST}&zip=${zip}&benchmark=Public_AR_Current&format=json`);
    console.log('grid resposnse', gridResponse.data.result.addressMatches[0])
    console.log('lon', gridResponse.data.result.addressMatches[0].coordinates.x)
    console.log('lat', gridResponse.data.result.addressMatches[0].coordinates.y)
    const latLongInfo = [gridResponse.data.result.addressMatches[0].coordinates.y, gridResponse.data.result.addressMatches[0].coordinates.x]
    return latLongInfo
}

module.exports = {getLatLon}