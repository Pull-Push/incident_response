const API_BASE_URL = 'http://localhost:5050'

//GET WEATHER DATA
export const getWeather = async () =>{
    const response = await fetch(`${API_BASE_URL}/api/dashboard`)
    if(!response.ok) throw new Error('Failed to fetch weather')
        return response.json()
}