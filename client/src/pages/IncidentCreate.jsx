import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { createIncident, getCustomers } from '../services/api'

const INCIDENT_TYPES = [
    'Equipment Failure',
    'Dispatch Center Outage',
    'Radio Tower Issue',
    'Network Outage',
    '911 System Down',
    'Scheduled Maintenance',
    'Other'
]

export default function CreateIncident() {
    const navigate = useNavigate()
    const location = useLocation()

    // Support pre-filling from IndyCustomer page
    const prefill = location.state || {}

    const [customers, setCustomers] = useState([])
    const [form, setForm] = useState({
        customer_id: prefill.customer_id || '',
        make: '',
        model: '',
        serial: '',
        location: '',
        incident_type: '',
        physical_damage: false,
        water_damage: false,
        notes: '',
        tech_assigned: ''
    })
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        getCustomers().then(setCustomers).catch(console.error)
    }, [])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            const newIncident = await createIncident(form)
            navigate(`/incidents/${newIncident.id}`)
        } catch (err) {
            setError('Failed to create incident. Please try again.')
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
                    <button className="btn btn-sm" onClick={() => navigate(-1)}>← Back</button>
                    <h1>Create New Incident</h1>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <form className="form-card" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h3>Incident Details</h3>

                        <div className="form-group">
                            <label htmlFor="customer_id">Customer *</label>
                            <select name="customer_id" id="customer_id" required value={form.customer_id} onChange={handleChange}>
                                <option value="">Select a customer...</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.name} {c.dept ? `— ${c.dept}` : ''}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="incident_type">Incident Type *</label>
                            <select name="incident_type" id="incident_type" required value={form.incident_type} onChange={handleChange}>
                                <option value="">Select type...</option>
                                {INCIDENT_TYPES.map(t => (
                                    <option key={t} value={t}>{t}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="location">Location / Site Description *</label>
                            <input type="text" name="location" id="location" required value={form.location} onChange={handleChange} placeholder="e.g. Main dispatch room, Tower 3" />
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Equipment</h3>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="make">Make *</label>
                                <input type="text" name="make" id="make" required value={form.make} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="model">Model *</label>
                                <input type="text" name="model" id="model" required value={form.model} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label htmlFor="serial">Serial # *</label>
                                <input type="text" name="serial" id="serial" required value={form.serial} onChange={handleChange} />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group form-checkbox">
                                <input type="checkbox" name="physical_damage" id="physical_damage" checked={form.physical_damage} onChange={handleChange} />
                                <label htmlFor="physical_damage">Physical Damage</label>
                            </div>
                            <div className="form-group form-checkbox">
                                <input type="checkbox" name="water_damage" id="water_damage" checked={form.water_damage} onChange={handleChange} />
                                <label htmlFor="water_damage">Water Damage</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3>Notes</h3>
                        <div className="form-group">
                            <label htmlFor="notes">Incident Notes</label>
                            <textarea name="notes" id="notes" rows={4} value={form.notes} onChange={handleChange} placeholder="Describe the issue..." />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? 'Creating...' : 'Create Incident'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
