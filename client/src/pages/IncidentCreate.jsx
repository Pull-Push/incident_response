import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"

export default function CreateIncident(){
    const navigate = useNavigate()
    
    function handleSubmit(){
        alert('Incident Created')
        navigate('/incidents')
    }
    return(
        <div className="incidentCreateMain">
            <NavBar/>
            <h1>Create An Incident</h1>
            <form action={()=> handleSubmit()}>
                <label>Customer Name</label>
                <input type="text" name="incidentName" id="incidentName" />
                <button type="submit">Create Incident</button>
            </form>
        </div>
    )
}