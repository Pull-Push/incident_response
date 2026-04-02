import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { getUser, updateUser, deactivateUser } from '../services/api'

export default function IndyUser() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    const [profile, setProfile] = useState(null)
    const [editingProfile, setEditingProfile] = useState(false)

    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true)
                const data = await getUser(id)
                setUser(data)
                setProfile(data)
            } catch (error) {
                setError(error.message)
            } finally {
                setLoading(false)
            }
        }
        loadUser()
    }, [id])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setProfile(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            const updated = await updateUser(id, profile)
            setUser(updated)
            setEditingProfile(false)
        } catch (error) {
            setError(`Failed to update user: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }

    const handleDeactivate = async () => {
        if (!confirm('Deactivate this user? They will no longer be able to log in.')) return
        try {
            setSaving(true)
            const updated = await deactivateUser(id)
            setUser(updated)
            navigate(-1)
        } catch (error) {
            setError(`Failed to deactivate user: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }

    const toggleEditUser = () => setEditingProfile(!editingProfile)

    if (loading) return <div className="page-main"><NavBar /><div className="loading">Loading...</div></div>
    if (error) return <div className="page-main"><NavBar /><div className="error-banner">{error}</div></div>
    if (!user) return <div className="page-main"><NavBar /><div className="error-banner">User not found.</div></div>

    return (
        <div className="page-main">
            <NavBar />
            <div className="page-content">
                {/* Header */}
                <div className="page-header">
                    <div>
                        <button className="btn btn-sm btn-secondary" onClick={() => navigate(-1)}>← Back</button>
                        <h1 style={{ marginTop: '8px' }}>{user.first_name} {user.last_name}</h1>
                        <p className="subtitle">{user.position} · Employee #{user.employee_number}</p>
                    </div>
                    <div className="header-actions">
                        <span className={`badge ${user.is_valid ? 'badge-complete' : 'badge-no-contract'}`}>
                            {user.is_valid ? 'Active' : 'Inactive'}
                        </span>
                        {user.is_manager && <span className="badge badge-active">Manager</span>}
                        {user.is_sales && <span className="badge badge-contract">Sales</span>}
                        {user.is_service && <span className="badge badge-complete">Service</span>}
                    </div>
                </div>

                {/* Detail Cards */}
                <div className="detail-grid">
                    <div className="detail-card">
                        <h3>Contact</h3>
                        <p><strong>Email</strong></p>
                        <p>{user.email}</p>
                        {user.phone && (
                            <>
                                <p style={{ marginTop: '10px' }}><strong>Phone</strong></p>
                                <p>{user.phone}</p>
                            </>
                        )}
                    </div>

                    <div className="detail-card">
                        <h3>Permissions</h3>
                        <p>Manager: {user.is_manager ? '✅ Yes' : '—'}</p>
                        <p>Sales: {user.is_sales ? '✅ Yes' : '—'}</p>
                        <p>Service: {user.is_service ? '✅ Yes' : '—'}</p>
                    </div>

                    <div className="detail-card">
                        <h3>Timeline</h3>
                        <p><strong>Created</strong></p>
                        <p>{new Date(user.created_at).toLocaleString()}</p>
                        <p style={{ marginTop: '10px' }}><strong>Last Updated</strong></p>
                        <p>{new Date(user.updated_at).toLocaleString()}</p>
                    </div>
                </div>

                {/* Edit Form or Action Buttons */}
                {editingProfile ? (
                    <div className="form-card">
                        <div className="form-section">
                            <h3>Edit User</h3>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="first_name">First Name</label>
                                    <input type="text" name="first_name" id="first_name" value={profile.first_name} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="last_name">Last Name</label>
                                    <input type="text" name="last_name" id="last_name" value={profile.last_name} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="employee_number">Employee Number</label>
                                    <input type="text" name="employee_number" id="employee_number" value={profile.employee_number} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="position">Position</label>
                                    <input type="text" name="position" id="position" value={profile.position} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input type="email" name="email" id="email" value={profile.email} onChange={handleChange} />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="phone">Phone</label>
                                    <input type="tel" name="phone" id="phone" value={profile.phone || ''} onChange={handleChange} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">New Password <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(leave blank to keep current)</span></label>
                                <input type="password" name="password" id="password" value={profile.password || ''} onChange={handleChange} placeholder="••••••••" />
                            </div>
                            <div className="form-row" style={{ marginTop: '8px' }}>
                                <div className="form-group form-checkbox">
                                    <input type="checkbox" name="is_manager" id="is_manager" checked={profile.is_manager} onChange={handleChange} />
                                    <label htmlFor="is_manager">Manager</label>
                                </div>
                                <div className="form-group form-checkbox">
                                    <input type="checkbox" name="is_sales" id="is_sales" checked={profile.is_sales} onChange={handleChange} />
                                    <label htmlFor="is_sales">Sales</label>
                                </div>
                                <div className="form-group form-checkbox">
                                    <input type="checkbox" name="is_service" id="is_service" checked={profile.is_service} onChange={handleChange} />
                                    <label htmlFor="is_service">Service</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                            <button className="btn btn-secondary" onClick={() => { setEditingProfile(false); setProfile(user) }}>
                                Cancel
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="action-buttons">
                        <button className="btn btn-secondary" onClick={toggleEditUser}>Edit User</button>
                        <button className="btn btn-danger" onClick={handleDeactivate} disabled={saving}>
                            {saving ? 'Processing...' : 'Deactivate User'}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
