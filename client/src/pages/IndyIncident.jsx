import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { getIncident, updateIncident } from '../services/api'

export default function IndyIncident() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [incident, setIncident] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [techNotes, setTechNotes] = useState('')
    const [editingNotes, setEditingNotes] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                const data = await getIncident(id)
                setIncident(data)
                setTechNotes(data.technician_notes || '')
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
            </div>
        </div>
    )
}
