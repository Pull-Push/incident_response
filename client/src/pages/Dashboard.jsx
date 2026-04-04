import { useEffect, useState } from "react"
import NavBar from "../components/NavBar"
import { getDash } from "../services/api"
import Weather from "../components/Weather"
import Map from "../components/Map"
import ActiveIncidents from "../components/ActiveIncidents"

export default function Dashboard() {
    const [loading, setLoading ] = useState(false)
    const [error, setError] = useState(null)
    const [location, setLocation] = useState(null)
    const [activeIncidents, setActiveIncidents] = useState([])
    const [weather, setWeather] = useState(null)

    useEffect(() =>{
        fetchDashboard()
    }, [])


    const fetchDashboard = async () =>{
    try {
        setLoading(true)
        const {weatherResult, activeIncidents} = await getDash() 
        setLocation(weatherResult.locationInfo)
        setActiveIncidents(activeIncidents)
        setWeather(weatherResult.local)
    } catch (error) {
        setError(error.message)
    }finally{
        setLoading(false)
    }
}

    return (
        <div className="page-main">
            <NavBar />
            <div className="page-content">
                <div className="page-header">
                    <h1>Dashboard</h1>
                    {loading && <div className="loading">Loading Dashboard...</div>}
                    {error && <div className="error-banner">{error}</div>}
                </div>
                    <Weather weather={weather} location={location} />
                    <Map />
                    <ActiveIncidents activeIncidents={activeIncidents}/>
            </div>
        </div>
    )
}
