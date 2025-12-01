import { useEffect, useState } from "react"
import { getCustomers } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";


export default function Customers(){
    const [customers, setCustomers ] = useState([])
    const [loading, setLoading ] = useState(true)
    const [error, setError ] = useState(null);
    
    const navigate = useNavigate()

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
            <NavBar/>
            <h1>This is the main customer page</h1>
            <button className="btn btn-primart" onClick={() => navigate('/create/customer')}>Create a Customer</button>
            <h3>customer info goes below here</h3>
            {customers.map((customer, key) =>(
                <div key={key}>
                    <p>{customer.id} {customer.name} {customer.dept}</p>
                    <Link to={`view/${customer.id}`}>View</Link>
                    <Link to={`edit/${customer.id}`}>Edit</Link>
                </div>
            ))}
        </div>
    )
}