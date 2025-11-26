const API_BASE_URL = 'http://localhost:5050'
// const API_BASE_URL = 'http://192.168.50.117:5050' set to machine ip for mobile testing!!


//GET WEATHER DATA
export const getWeather = async () =>{
    const response = await fetch(`${API_BASE_URL}/api/dashboard`)
    if(!response.ok) throw new Error('Failed to fetch weather')
        return response.json()
}
