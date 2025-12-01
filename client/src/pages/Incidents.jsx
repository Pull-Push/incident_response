import { Link } from "react-router-dom"
import NavBar from "../components/NavBar"

export default function Incidents(){
    return(
        <div className="incidentsMain">
            <NavBar/>
            <h1>All Incidents</h1>
            <h3>Active Incidents Below</h3>
            <Link to={'/create/incident'}>Create New Incident</Link>
        </div>
    )
}