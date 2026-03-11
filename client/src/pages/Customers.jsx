import { useEffect, useState } from "react"
import { getCustomers } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";


export default function Customers(){
    const [customers, setCustomers ] = useState([])
    const [loading, setLoading ] = useState(true)
    const [error, setError ] = useState(null);
    const [search, setSearch] = useState('');
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

    const filtered = customers.filter(customer => 
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.city.toLowerCase().includes(search.toLowerCase()) ||
        customer.contact.toLowerCase().includes(search.toLowerCase())
    )

        return (
            <div className="page-main">
                <NavBar />
                <div className="page-content">
                    <div className="page-header">
                        <h1>Customers</h1>
                        <button className="btn btn-primary" onClick={() => navigate('/create/customer')}>+ New Customer</button>
                    </div>
    
                    {error && <div className="error-banner">{error}</div>}
    
                    <input
                        className="search-input"
                        type="text"
                        placeholder="Search by name, city, or contact..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
    
                    {loading ? (
                        <div className="loading">Loading customers...</div>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Department</th>
                                    <th>City</th>
                                    <th>State</th>
                                    <th>Contact</th>
                                    <th>Phone</th>
                                    <th>Contract</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.length === 0 ? (
                                    <tr><td colSpan="8" className="empty-msg">No customers found.</td></tr>
                                ) : (
                                    filtered.map(customer => (
                                        <tr key={customer.id}>
                                            <td>{customer.name}</td>
                                            <td>{customer.dept || '—'}</td>
                                            <td>{customer.city}</td>
                                            <td>{customer.state}</td>
                                            <td>{customer.contact}</td>
                                            <td>{customer.phone}</td>
                                            <td>{customer.contract ? '✅' : '—'}</td>
                                            <td><Link to={`/customers/${customer.id}`} className="btn btn-sm">View</Link></td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        )
}