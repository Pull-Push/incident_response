import { useState, useContext } from "react"
import { useNavigate } from "react-router-dom"
import NavBar from "../components/NavBar"
import { createCustomer } from "../services/api"
import { AuthContext } from "../context/AuthContext"

export default function CreateCustomer() {
    const navigate = useNavigate()
    const { currentUser } = useContext(AuthContext)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [customer, setCustomer] = useState({
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

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            await createCustomer(customer)
            navigate('/customers')
        } catch (err) {
            setError('Failed to create customer. Please try again.')
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="page-main">
            <NavBar />
            <div className="page-content">
                <div className="page-header">
                    <button className="btn btn-secondary btn-sm" onClick={() => navigate('/customers')}>← Back</button>
                    <h1>Create Customer</h1>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <form className="form-card" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Customer Details</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name">Customer Name *</label>
                                <input type="text" name="name" id="name" required value={customer.name} onChange={handleChange} placeholder="ACME Corp" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dept">Department</label>
                                <input type="text" name="dept" id="dept" value={customer.dept} onChange={handleChange} placeholder="Police, Fire, EMS..." />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="contact">Contact Name *</label>
                                <input type="text" name="contact" id="contact" required value={customer.contact} onChange={handleChange} placeholder="John Smith" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="phone">Phone Number *</label>
                                <input type="tel" name="phone" id="phone" required value={customer.phone} onChange={handleChange} placeholder="201-555-0100" />
                            </div>
                        </div>
                        <div className="form-group form-checkbox">
                            <input type="checkbox" name="contract" id="contract" checked={customer.contract} onChange={handleChange} />
                            <label htmlFor="contract">Contract Customer</label>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Address</h3>
                        <div className="form-group">
                            <label htmlFor="address">Street Address *</label>
                            <input type="text" name="address" id="address" required value={customer.address} onChange={handleChange} placeholder="123 Main St" />
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="city">City *</label>
                                <input type="text" name="city" id="city" required value={customer.city} onChange={handleChange} placeholder="Anytown" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="state">State *</label>
                                <input type="text" name="state" id="state" required maxLength={2} value={customer.state} onChange={handleChange} placeholder="NJ" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="zip">Zip Code *</label>
                                <input type="text" name="zip" id="zip" required value={customer.zip} onChange={handleChange} placeholder="07601" />
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="lat">Latitude <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional — auto-geocoded)</span></label>
                                <input type="text" name="lat" id="lat" value={customer.lat || ''} onChange={handleChange} placeholder="40.9480" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="long">Longitude <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(optional)</span></label>
                                <input type="text" name="long" id="long" value={customer.long || ''} onChange={handleChange} placeholder="-74.0592" />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Notes</h3>
                        <div className="form-group">
                            <label htmlFor="notes">Internal Notes</label>
                            <textarea name="notes" id="notes" rows={4} value={customer.notes} onChange={handleChange} placeholder="Any relevant notes about this customer..." />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Customer'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate('/customers')}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
