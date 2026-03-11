import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { getCustomer, getIncidents } from '../services/api'

export default function IndyCustomer() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [customer, setCustomer] = useState(null)
    const [incidents, setIncidents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                const [customerData, allIncidents] = await Promise.all([
                    getCustomer(id),
                    getIncidents()
                ])
                setCustomer(customerData)
                // Filter incidents belonging to this customer
                setIncidents(allIncidents.filter(i => i.customer_id === parseInt(id)))
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    if (loading) return <div className="page-main"><NavBar /><div className="loading">Loading...</div></div>
    if (error) return <div className="page-main"><NavBar /><div className="error-banner">{error}</div></div>
    if (!customer) return <div className="page-main"><NavBar /><div className="error-banner">Customer not found.</div></div>

    const activeIncidents = incidents.filter(i => !i.is_complete)
    const completedIncidents = incidents.filter(i => i.is_complete)

    return (
        <div className="page-main">
            <NavBar />
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <button className="btn btn-sm" onClick={() => navigate('/customers')}>← Back</button>
                        <h1>{customer.name}</h1>
                        {customer.dept && <p className="subtitle">{customer.dept}</p>}
                    </div>
                    <div className="header-actions">
                        <span className={`badge ${customer.contract ? 'badge-contract' : 'badge-no-contract'}`}>
                            {customer.contract ? 'Contract Customer' : 'No Contract'}
                        </span>
                        <Link to={`/create/incident`} state={{ customer_id: customer.id, customer_name: customer.name }} className="btn btn-primary">
                            + New Incident
                        </Link>
                    </div>
                </div>

                <div className="detail-grid">
                    <div className="detail-card">
                        <h3>Address</h3>
                        <p>{customer.add_num} {customer.street}</p>
                        <p>{customer.city}, {customer.state} {customer.zip}</p>
                        {customer.lat && customer.long && (
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${customer.lat},${customer.long}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-sm"
                            >
                                View on Maps
                            </a>
                        )}
                    </div>

                    <div className="detail-card">
                        <h3>Contact</h3>
                        <p><strong>{customer.contact}</strong></p>
                        <p>{customer.phone}</p>
                    </div>

                    {customer.notes && (
                        <div className="detail-card detail-card-wide">
                            <h3>Notes</h3>
                            <p>{customer.notes}</p>
                        </div>
                    )}
                </div>

                <div className="section">
                    <div className="section-header">
                        <h2>Active Incidents ({activeIncidents.length})</h2>
                    </div>
                    {activeIncidents.length === 0 ? (
                        <p className="empty-msg">No active incidents.</p>
                    ) : (
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Equipment</th>
                                    <th>Location</th>
                                    <th>Technician</th>
                                    <th>Created</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {activeIncidents.map(i => (
                                    <tr key={i.id}>
                                        <td>#{i.id}</td>
                                        <td>{i.incident_type}</td>
                                        <td>{i.make} {i.model}</td>
                                        <td>{i.location}</td>
                                        <td>{i.technician || 'Unassigned'}</td>
                                        <td>{new Date(i.created_at).toLocaleDateString()}</td>
                                        <td><Link to={`/incidents/${i.id}`} className="btn btn-sm">View</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {completedIncidents.length > 0 && (
                    <div className="section">
                        <h2>Completed Incidents ({completedIncidents.length})</h2>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type</th>
                                    <th>Equipment</th>
                                    <th>Technician</th>
                                    <th>Completed</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {completedIncidents.map(i => (
                                    <tr key={i.id}>
                                        <td>#{i.id}</td>
                                        <td>{i.incident_type}</td>
                                        <td>{i.make} {i.model}</td>
                                        <td>{i.technician || '—'}</td>
                                        <td>{new Date(i.updated_at).toLocaleDateString()}</td>
                                        <td><Link to={`/incidents/${i.id}`} className="btn btn-sm">View</Link></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}
