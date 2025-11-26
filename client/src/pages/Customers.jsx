import { useEffect, useState } from "react"
import { getCustomers } from "../services/api";

export default function Customers(){
    const [customers, setCustomers ] = useState([])
    const [loading, setLoading ] = useState(true)
    const [error, setError ] = useState(null);
    
    useEffect(() => {
        const fetchCustomers = async () =>{
            try {
                setLoading(true);
                const data = await getCustomers()
                setCustomers(data)
            } catch (error) {
                setError(error.message)
                console.error("error fetching weather", error)
            } finally{
                setLoading(false)
            }
        }
        fetchCustomers();
    }, []);

    if (loading) return <div> Data Loading</div>
    if(error) return <div>Error: {error}</div>

    return(
        <div className="customer-main">
            <h1>This is the main customer page</h1>
            <h3>customer info goes below here</h3>
            {customers.map((customer, key) =>(
                <p key={key}>{customer.name} {customer.dept}</p>
            ))}
        </div>
    )
}