import { useState } from "react";
import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import { createCustomer } from "../services/api"


export default function CreateCustomer(){
    const navigate = useNavigate()
    const [customerName, setCustomerName] = useState("")
    const [ dept, setDept ] = useState("") 
    const [ addNum, setAddNum ] = useState("")
    const [street, setStreet ] = useState("")
    const [city, setCity ] = useState("")
    const [state, setState ] = useState("")
    const [zip, setZip] = useState("")
    const [notes, setNotes ] =useState("")
    const [contact, setContact] =useState("")
    const [phone, setPhone] =useState("")
    const [contract, setContract] = useState(false)
    const [lat, setLat] =useState(null)
    const [long, setLong] =useState(null)

    function handleSubmit(e){
        e.preventDefault();
        alert('Cutomer Created', e)
        let newCustomer = {
            name:customerName,
            dept:dept,
            addNum:addNum,
            street:street,
            city:city,
            state:state,
            zip:zip,
            contact:contact,
            phone:phone,
            contract:contract,
            notes:notes,
            lat:lat,
            long:long
        }
        createCustomer(newCustomer)
        navigate('/customers')
    }
    return(
        <div className="customerCreateMain">
            <NavBar/>
            <h1>Create A Customer</h1>
            <form onSubmit={handleSubmit}>
                
                <label htmlFor='customerName' >Customer Name</label>
                <input type="text" name="customerName" id="customerName" required onChange={(e) => setCustomerName(e.target.value)}/>
                
                <label htmlFor="dept">Department</label>
                <input type="text" name="dept" id="dept" onChange={(e) => setDept(e.target.value)}/>
                
                <label htmlFor="addNum">Address Number</label>
                <input type="text" name="addNum" id="addNum" required onChange={(e) => setAddNum(e.target.value)}/>
                
                <label htmlFor="street">Street Name</label>
                <input type="text" name="street" id="street" required onChange={(e) => setStreet(e.target.value)}/>
                
                <label htmlFor="city">City</label>
                <input type="text" name="city" id="city" required onChange={(e) => setCity(e.target.value)}/>
                
                <label htmlFor="state">State</label>
                <input type="text" name="state" id="state" required onChange={(e) => setState(e.target.value)}/>
                
                <label htmlFor="zip">Zip</label>
                <input type="text" name="zip" id="zip" required onChange={(e) => setZip(e.target.value)}/>
                
                <label htmlFor="contact">Contact</label>
                <input type="text" name="contact" id="contact" required onChange={(e) => setContact(e.target.value)}/>
                
                <label htmlFor="phone">Phone Number</label>
                <input type="text" name="phone" id="phone" required onChange={(e) => setPhone(e.target.value)}/>
                
                <label htmlFor="contract">Contract Customer</label>
                <input type="checkbox" name="contract" id="contract" value='true' onChange={(e) => setContract(e.target.value)}/>
                
                <label htmlFor="notes">Notes</label>
                <textarea name="notes" id="notes" onChange={(e) => setNotes(e.target.value)}></textarea>
                
                <label htmlFor="lat">Latitude</label>
                <input type="text" name="lat" id="lat"  onChange={(e) => setLat(e.target.value)}/>
                
                <label htmlFor="long">Longitude</label>
                <input type="text" name="long" id="long"  onChange={(e) => setLong(e.target.value)}/>

                
                <button type="submit">Create Customer</button>
            </form>
        </div>
    )
}