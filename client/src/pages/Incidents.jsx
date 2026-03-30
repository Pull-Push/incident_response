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

    const activeIncidents = incidents.filter(incident => incident.status !== 'complete')
    const completedIncidents = incidents.filter(incident => incident.status === 'complete')

    return (
            <div className="page-main">
                <NavBar />
                <div className="page-content">
                    <div className="page-header">
                        <h1>Incidents</h1>
                        <Link to="/create/incident" className="btn btn-primary">+ New Incident</Link>
                    </div>
    
                    {error && <div className="error-banner">{error}</div>}
                    {loading && <div className="loading">Loading incidents...</div>}
    
                    {!loading && !error && (
                        <>
                            <h2>Active ({activeIncidents.length})</h2>
                            <IncidentTable incidents={activeIncidents} />
    
                            <h2>Completed ({completedIncidents.length})</h2>
                            <IncidentTable incidents={completedIncidents} />
                        </>
                    )}
                </div>
            </div>
        )
    }
    
    function IncidentTable({ incidents }) {
        if (incidents.length === 0) return <p className="empty-msg">None found.</p>
    
        return (
            <table className="data-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Type</th>
                        <th>Equipment</th>
                        <th>Location</th>
                        <th>Technician</th>
                        <th>Created</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {incidents.map(incident => (
                        <tr key={incident.id}>
                            <td>#{incident.id}</td>
                            <td>{incident.customer || '—'}</td>
                            <td><span className={`badge badge-${incident.incident_type?.toLowerCase().replace(/\s/g, '-')}`}>{incident.incident_type}</span></td>
                            <td>{incident.make} {incident.model}</td>
                            <td>{incident.location}</td>
                            <td>{incident.technician || 'Unassigned'}</td>
                            <td>{new Date(incident.created_at).toLocaleDateString()}</td>
                            <td><Link to={`/incidents/${incident.id}`} className="btn btn-sm">View</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        )
    }