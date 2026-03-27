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
    if (loading) return <div className="page-main"><NavBar /><div className="loading">Loading...</div></div>
    if (error) return <div className="page-main"><NavBar /><div className="error-banner">{error}</div></div>
    if (!user) return <div className="page-main"><NavBar /><div className="error-banner">User not found.</div></div>
    
    return(
        <div className='indyUserMain'>

        </div>
    )
}