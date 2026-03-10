import React, {useState, useEffect} from "react"
import { Link } from "react-router-dom"
import NavBar from "../components/NavBar"
import { getIncidents } from "../services/api"


export default function Incidents(){
    const [incidents, setIncidents ] = useState([])
    const [loading, setLoading ] = useState(false)
    const [error, setError ] = useState(null)

    useEffect(()=>{
        loadIncidents()
    },[])

    const loadIncidents = async() =>{
        setLoading(true);
        setError(null);
        try {
            const data = await getIncidents();
            setIncidents(data)
        } catch (error) {
            console.error('Error loading Incidents', error)
            setError('Failed to load Incidents, Please try again')
        }finally{
            setLoading(false)
        }
    }

    return(
        <div className="incidentsMain">
            <NavBar/>
            <h1>All Incidents</h1>
            {error && <div className="error">{error}</div>}
            {loading && <p>Loading incidents...</p>}
            <div className="incidents-list">
                {incidents.length === 0 ? (
                <p>No incidents yet...</p>   
                ):(
                    <ul>
                        {incidents.map((incident) =>(
                            <li key={incident.id}>
                                <p className="customerName">{incident.customer}</p>
                                <p className="incidentType">{incident.incident_type}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>            
            <h3>Active Incidents Below</h3>
            <Link to={'/create/incident'}>Create New Incident</Link>
        </div>
    )
}