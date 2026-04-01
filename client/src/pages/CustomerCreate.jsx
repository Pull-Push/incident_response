import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import { createCustomer } from "../services/api"
import { AuthContext } from "../context/AuthContext";


export default function CreateCustomer(){
    const navigate = useNavigate()
    const {currentUser} = useContext(AuthContext)
    const [ customer, setCustomer ] = useState({
        name: "",
        dept: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        notes: "",
        contact: "",
        phone: "",
        contract: false,
        lat: null,
        long: null,
        created_by: currentUser?.id
    })

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setCustomer(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }
    async function handleSubmit(e){
        e.preventDefault();
        try {
            await createCustomer(customer)
            navigate('/customers')
        } catch (error) {
            console.error('Failed to create customer', error)
        }
    }
    return(
        <div className="customerCreateMain">
            <NavBar/>
            <h1>Create A Customer</h1>
            <form onSubmit={handleSubmit}>
                
                <label htmlFor='name' >Customer Name</label>
                <input type="text" name="name" id="name" required onChange={handleChange}/>
                
                <label htmlFor="dept">Department</label>
                <input type="text" name="dept" id="dept" onChange={handleChange}/>
                
                <label htmlFor="address">Address</label>
                <input type="text" name="address" id="address" required onChange={handleChange}/>
                
                <label htmlFor="city">City</label>
                <input type="text" name="city" id="city" required onChange={handleChange}/>
                
                <label htmlFor="state">State</label>
                <input type="text" name="state" id="state" required onChange={handleChange}/>
                
                <label htmlFor="zip">Zip</label>
                <input type="text" name="zip" id="zip" required onChange={handleChange}/>
                
                <label htmlFor="contact">Contact</label>
                <input type="text" name="contact" id="contact" required onChange={handleChange}/>
                
                <label htmlFor="phone">Phone Number</label>
                <input type="text" name="phone" id="phone" required onChange={handleChange}/>
                
                <label htmlFor="contract">Contract Customer</label>
                <input type="checkbox" name="contract" id="contract" checked={customer.contract} onChange={handleChange}/>
                
                <label htmlFor="notes">Notes</label>
                <textarea name="notes" id="notes" onChange={handleChange}></textarea>
                
                <label htmlFor="lat">Latitude</label>
                <input type="text" name="lat" id="lat"  onChange={handleChange}/>
                
                <label htmlFor="long">Longitude</label>
                <input type="text" name="long" id="long"  onChange={handleChange}/>

                
                <button type="submit">Create Customer</button>
            </form>
        </div>
    )
}