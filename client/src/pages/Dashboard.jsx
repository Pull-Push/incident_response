import { useEffect, useState } from "react";
import { getWeather } from "../services/api";


export default function Dashboard(){
const [weather, setWeather ] = useState(null)
const [location, setLocation] = useState(null)
const [loading, setLoading ] = useState(true)
const [error, setError ] = useState(null);

useEffect(()=>{
    const fetchWeather = async () =>{
        try {
            setLoading(true);
            const data = await getWeather();
            console.log('data', data)
            setWeather(data.local)
            setLocation(data.locationInfo)
        }catch(err){
            setError(err.message)
            console.error("error fetching weather", err)
        }finally{
            setLoading(false)
        }
    }
    fetchWeather();
},[])

    if (loading) return <div> Data Loading</div>
    if(error) return <div>Error: {error}</div>

    return(
        <div className="dashMain">
            <h1>Welcome to the dashboard</h1>
            <h2>Weather for {location.name}, {location.state}</h2>
            {weather.map((day, index) =>(
                <div key={index}>
                    <p>{day.name}</p>
                    <img src={day.icon} alt={day.shortForecast} />
                    <p>{day.temperature} {day.temperatureUnit}</p>
                    <p>{day.detailedForecast}</p>
                </div>
            ))}
            {/* <pre>{JSON.stringify(weather, null, 2)}</pre> */}
        </div>
    )
}