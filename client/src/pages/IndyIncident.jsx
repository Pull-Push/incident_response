import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { getIncident, updateIncident, getUsers } from '../services/api'

export default function IndyIncident() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [incident, setIncident] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [techNotes, setTechNotes] = useState('')
    const [editingNotes, setEditingNotes] = useState(false)
    const [editMode, setEditMode] = useState(false)
    const [incidentInfo, setIncidentInfo] = useState(null)
    const [users, setUsers] = useState([])

    const INCIDENT_TYPES = [
    'Equipment Failure',
    'Dispatch Center Outage',
    'Radio Tower Issue',
    'Network Outage',
    '911 System Down',
    'Scheduled Maintenance',
    'Other'
]

    const STATUS_TYPES = [
        'open',
        'pending',
        'in_progress',
        'complete',
        'cancelled'
    ]


    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                const data = await getIncident(id)
                setIncident(data)
                setIncidentInfo(data)
                setTechNotes(data.technician_notes || '')
                const userData = await getUsers()
                const techs = userData.filter(singleUser => singleUser.is_manager || singleUser.is_service)
                setUsers(techs)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [id])

    const handleMarkComplete = async () => {
        if (!confirm('Mark this incident as complete?')) return
        try {
            setSaving(true)
            const updated = await updateIncident(id, { status: 'complete' })
            setIncident(updated)
        } catch (err) {
            setError(`Failed to update incident: ${err.message}`)
        } finally {
            setSaving(false)
        }
    }

    const handleReopenIncident = async () => {
        try {
            setSaving(true)
            const updated = await updateIncident(id, { status: 'open' })
            setIncident(updated)
        } catch (err) {
            setError(`Failed to update incident: ${err.message}`)
        } finally {
            setSaving(false)
        }
    }

    const handleSaveNotes = async () => {
        try {
            setSaving(true)
            const updated = await updateIncident(id, { technician_notes: techNotes })
            setIncident(updated)
            setEditingNotes(false)
        } catch (err) {
            setError(`Failed to update incident: ${err.message}`)
        } finally {
            setSaving(false)
        }
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setIncidentInfo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }
    const handleSave = async () => {
        try {
            setSaving(true)
            const updated = await updateIncident(id, incidentInfo)
            setIncident(updated)
            setEditMode(false)
        } catch (error) {
            setError(`Failed to update incident:${error.message}`)
        }finally{
            setSaving(false)
        }
    }
    const toggleEdit = () => setEditMode(!editMode)
    
    const cancelEdit = () => {
        setIncidentInfo(incident)
        toggleEdit()
    }

    if (loading) return <div className="page-main"><NavBar /><div className="loading">Loading...</div></div>
    if (error) return <div className="page-main"><NavBar /><div className="error-banner">{error}</div></div>
    if (!incident) return <div className="page-main"><NavBar /><div className="error-banner">Incident not found.</div></div>

    return (
        <div className="page-main">
            <NavBar />
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <button className="btn btn-sm" onClick={() => navigate(-1)}>← Back</button>
                        <h1>Incident #{incident.id}</h1>
                        <p className="subtitle">{incident.customer}</p>
                    </div>
                    <div className="header-actions">
                        <span className={`badge ${incident.status ==='complete' ? 'badge-complete' : 'badge-active'}`}>
                            {incident.status === 'complete' ? 'complete' : 'open'}
                        </span>
                        {incident.status !== 'complete' ? (
                            <button className="btn btn-success" onClick={handleMarkComplete} disabled={saving}>
                                {saving ? 'Saving...' : 'Mark Complete'}
                            </button>
                        ) : (
                            <button className="btn btn-secondary" onClick={handleReopenIncident} disabled={saving}>
                                Reopen
                            </button>
                        )}
                    </div>
                </div>

                <div className="detail-grid">
                    <div className="detail-card">
                        <h3>Incident Type</h3>
                        <p className="detail-value">{incident.incident_type}</p>
                    </div>

                    <div className="detail-card">
                        <h3>Equipment</h3>
                        <p><strong>Make:</strong> {incident.make}</p>
                        <p><strong>Model:</strong> {incident.model}</p>
                        <p><strong>Serial:</strong> {incident.serial}</p>
                    </div>

                    <div className="detail-card">
                        <h3>Location</h3>
                        <p>{incident.location}</p>
                    </div>

                    <div className="detail-card">
                        <h3>Damage</h3>
                        <p>Physical: {incident.physical_damage ? '⚠️ Yes' : 'No'}</p>
                        <p>Water: {incident.water_damage ? '⚠️ Yes' : 'No'}</p>
                    </div>

                    <div className="detail-card">
                        <h3>Technician</h3>
                        <p>{incident.technician || 'Unassigned'}</p>
                    </div>

                    <div className="detail-card">
                        <h3>Timeline</h3>
                        <p><strong>Created By:</strong> {incident.created_by_name}</p>
                        <p><strong>Created:</strong> {new Date(incident.created_at).toLocaleString()}</p>
                        <p><strong>Updated:</strong> {new Date(incident.updated_at).toLocaleString()}</p>
                    </div>


                    {incident.notes && (
                        <div className="detail-card detail-card-wide">
                            <h3>Incident Notes</h3>
                            <p>{incident.notes}</p>
                        </div>
                    )}

                    <div className="detail-card detail-card-wide">
                        <div className="card-header-row">
                            <h3>Technician Notes</h3>
                            {!editingNotes && (
                                <button className="btn btn-sm" onClick={() => setEditingNotes(true)}>Edit</button>
                            )}
                        </div>
                        {editingNotes ? (
                            <>
                                <textarea
                                    className="notes-textarea"
                                    value={techNotes}
                                    onChange={e => setTechNotes(e.target.value)}
                                    rows={5}
                                    placeholder="Enter technician notes..."
                                />
                                <div className="btn-row">
                                    <button className="btn btn-primary" onClick={handleSaveNotes} disabled={saving}>
                                        {saving ? 'Saving...' : 'Save Notes'}
                                    </button>
                                    <button className="btn btn-secondary" onClick={() => { setEditingNotes(false); setTechNotes(incident.technician_notes || '') }}>
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p>{incident.technician_notes || 'No notes yet.'}</p>
                        )}
                    </div>
                </div>
            {editMode ? (
        <form className="form-card">
        <div className="form-section">
            <h3>Incident Details</h3>
            <div className="form-group">
                <label htmlFor="name">Make</label>
                <input type="text" name="make" id="make" required value={incidentInfo.make} onChange={handleChange} placeholder='Motorola'/>
            </div>

            <div className="form-group">
                <label htmlFor="model">Model</label>
                <input type="text" name="model" id="model" required value={incidentInfo.model} onChange={handleChange} placeholder='GTR-8000'/>
            </div>

            <div className="form-group">
                <label htmlFor="serial">Serial Number</label>
                <input type="text" name="serial" id="serial" required value={incidentInfo.serial} onChange={handleChange} placeholder='579ABCD7894'/>
            </div>
            
            <div className="form-group">
                <label htmlFor="location">Location</label>
                <input type="text" name="location" id="location" required value={incidentInfo.location} onChange={handleChange} placeholder='Main Dispatch'/>
            </div>

            <div className="form-group">
                <label htmlFor="physical_damage">Physical Damage</label>
                <input type="checkbox" name="physical_damage" id="physical_damage" checked={incidentInfo.physical_damage} onChange={handleChange}/>
            </div>
            
            <div className="form-group">
                <label htmlFor="water_damage">Water Damage</label>
                <input type='checkbox' name="water_damage" id="water_damage" checked={incidentInfo.water_damage} onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label htmlFor="incident_type">Incident Type</label>
                <select name="incident_type" id="incident_type" required value={incidentInfo.incident_type} onChange={handleChange}>
                    <option value="">Select type...</option>
                        {INCIDENT_TYPES.map(type => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                </select>
            </div>
            <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea name="notes" id="notes" value={incidentInfo.notes} onChange={handleChange}></textarea>
            </div>
            
            <div className="form-group">
                <label htmlFor="tech_assigned">Technician Assigned</label>
                <select name="tech_assigned" id="tech_assigned" required value={incidentInfo.tech_assigned} onChange={handleChange}>
                    <option value="">Select technician...</option>
                    {users.map(tech =>(
                        <option key={tech.id} value={tech.id}>{tech.first_name} {tech.last_name}</option>
                    ))}
                </select>
            </div>
            
            <div className="form-group">
                <label htmlFor="status">Status</label>
                <select name="status" id="status" required value={incidentInfo.status} onChange={handleChange}>
                    <option value="">Select status...</option>
                    {STATUS_TYPES.map(status =>(
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
            </div>
        </div>
        <div className="form-actions">
            <button onClick={()=> handleSave()} className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Incident'}
            </button>
            <button className='btn btn-sm' onClick={()=> cancelEdit()}>Cancel</button>
        </div>
    </form>
            ):(
            <button className='btn btn-sm' onClick={()=> toggleEdit()}>Edit Incident</button>
            )}

            </div>
        </div>
    )
}
