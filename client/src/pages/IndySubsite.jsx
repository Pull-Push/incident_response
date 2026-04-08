import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { getIndySubsite, updateSubsite, deactivateSubsite } from '../services/api'

export default function IndySubsite(){
    const {subsiteId} = useParams()
    const navigate = useNavigate()
    const [ subsite, setSubsite ] = useState(null)
    const [ loading, setLoading ] = useState(true)
    const [ saving, setSaving ] = useState(false)
    const [ error, setError ] = useState(null)
    const [ editMode, setEditMode ] = useState(false)
    const [ subsiteInfo, setSubsiteInfo ] = useState(null)

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                const data = await getIndySubsite(subsiteId)
                setSubsite(data)
                setSubsiteInfo(data)
            } catch (error) {
                setError(error.message)
            }finally{
                setLoading(false)
            }
        }
        load()
    }, [subsiteId])

    const handleChange = (e) =>{
        const { name, value, type, checked } = e.target
        setSubsiteInfo(prev => ({...prev, [name]:type === 'checkbox' ? checked:value}))
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            const updated = await updateSubsite(subsiteId, subsiteInfo)
            setSubsite(updated)
            setEditMode(false)
        } catch (error) {
            setError(`Failed to update subsite:${error.message}`)
        }finally{
            setSaving(false)
        }
    }
    const toggleEdit = () => setEditMode(!editMode)
    const cancelEdit = () =>{
        setSubsiteInfo(subsite)
        toggleEdit()
    }

    if(loading) return <div className="page-main"><NavBar/><div className="loading">Loading...</div></div>
    if(error) return <div className="page-main"><NavBar/><div className="error-banner">{error}</div></div>
    if(!subsite) return <div className="page-main"><NavBar/><div className="error-banner">Subsite not found.</div></div>

    return(
    <div>

    </div>
)

}