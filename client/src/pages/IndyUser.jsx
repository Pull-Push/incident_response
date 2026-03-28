import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { getUser, updateUser, deactivateUser } from '../services/api'

export default function IndyUser(){
    const { id } = useParams()
    const navigate = useNavigate();
    const [user, setUser ] = useState(null);
    const [loading, setLoading ] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [profile, setProfile ] = useState(null);
    const [editingProfile, setEditingProfile] = useState(false);

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
    }, [id]);
    
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
            setError(`Failed to update user:${error.message}`)
        }finally{
            setSaving(false)
        }
    }

    const handleDeactivate = async () => {
        if(!confirm('Deactivate this user?')) return
        try {
            setSaving(true)
            const updated = await deactivateUser(id)
            setUser(updated)
            navigate(-1)
        } catch (error) {
            setError(`Failed to update user: ${error.message}`)
        }finally{
            setSaving(false)
        }
    }
    const toggleEditUser = () => setEditingProfile(!editingProfile)

    if (loading) return <div className="page-main"><NavBar /><div className="loading">Loading...</div></div>
    if (error) return <div className="page-main"><NavBar /><div className="error-banner">{error}</div></div>
    if (!user) return <div className="page-main"><NavBar /><div className="error-banner">User not found.</div></div>
    
    return(
        <div className='indyUserMain'>
            <NavBar />
            <div className='page-content'>
                <div className='page-header'>
                    <div>
                        <button className='btn btn-sm' onClick={() => navigate(-1)}>Back</button>
                        <h1>Employee #{user.employee_number}</h1>
                        <h2>{user.first_name} {user.last_name}</h2>
                        <button className='btn btn-sm' onClick={() => handleDeactivate()}>Deactivate User</button>
                    </div>
                </div>
            <div className='detail-grid'>
                <div className='detail-card'>
                    <h3>User Details</h3>
                </div>
                <div className='detail-card'>
                    <p><strong>Employee Number:</strong>#{user.employee_number}</p>
                    <p><strong>First Name:</strong>{user.first_name}</p>
                    <p><strong>Last Name:</strong>{user.last_name}</p>
                    <p><strong>Position:</strong>{user.position}</p>
                    <p><strong>Email:</strong>{user.email}</p>
                </div>
                <div className='detail-card'>
                    <p>Manager: {user.is_manager ? 'Yes' : 'No'}</p>
                    <p>Sales: {user.is_sales ? 'Yes' : 'No'}</p>
                    <p>Service: {user.is_service ? 'Yes' : 'No'}</p>
                </div>
                <div className='detail-card'>
                    <p>Active: {user.is_valid ? 'Yes' : 'No'}</p>
                </div>
                <div className="detail-card">
                    <h3>Timeline</h3>
                        <p><strong>Created:</strong> {new Date(user.created_at).toLocaleString()}</p>
                        <p><strong>Updated:</strong> {new Date(user.updated_at).toLocaleString()}</p>
                    </div>
            </div>

            {editingProfile ? (
        <form className="form-card">
        <div className="form-section">
            <h3>User Details</h3>
            <div className="form-group">
                <label htmlFor="employee_number">Employee Number</label>
                <input type="text" name="employee_number" id="employee_number" required value={profile.employee_number} onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input type="text" name="first_name" id="first_name" required value={profile.first_name} onChange={handleChange} placeholder='John'/>
            </div>

            <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input type="text" name="last_name" id="last_name" required value={profile.last_name} onChange={handleChange} placeholder='Smith'/>
            </div>
            <div className="form-group">
                <label htmlFor="position">Position</label>
                <input type="text" name="position" id="position" required value={profile.position} onChange={handleChange} placeholder='Sales'/>
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" name="email" id="email" required value={profile.email} onChange={handleChange} placeholder='JSmith@company.com'/>
            </div>
            <div className="form-group">
                <label htmlFor="is_manager">Manager</label>
                <input type='checkbox' name="is_manager" id="is_manager" checked={profile.is_manager} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="is_sales">Sales</label>
                <input type='checkbox' name="is_sales" id="is_sales" checked={profile.is_sales} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="is_service">Service</label>
                <input type='checkbox' name="is_service" id="is_service" checked={profile.is_service} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type='password' name="password" id="password"  value={profile.password} onChange={handleChange}/>
            </div>
        </div>
        <div className="form-actions">
            <button onClick={()=> handleSave()} className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save User'}
            </button>
        </div>
    </form>
            ):(
                <button className='btn btn-sm' onClick={()=> toggleEditUser()}>Edit User</button>
            )}
        </div>
                </div>
    )
}