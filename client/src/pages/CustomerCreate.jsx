import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"

export default function CreateCustomer(){
    const navigate = useNavigate()
    
    function handleSubmit(){
        alert('Cutomer Created')
        navigate('/customers')
    }
    return(
        <div className="customerCreateMain">
            <NavBar/>
            <h1>Create A Customer</h1>
            <form action={()=> handleSubmit()}>
                <label>Customer Name</label>
                <input type="text" name="customerName" id="customerName" />
                <button type="submit">Create Customer</button>
            </form>
        </div>
    )
}