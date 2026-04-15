import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import NavBar from '../components/NavBar'
import { getCustomer, getIncidents, updateCustomer, getSubsites, createSubsite, updateSubsite, deactivateSubsite } from '../services/api'
import SiteMap from '../components/SiteMap'

export default function IndyCustomer() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [customer, setCustomer] = useState(null)
    const [incidents, setIncidents] = useState([])
    const [loading, setLoading] = useState(true)
    const [subsiteLoading, setSubsiteLoading ] = useState(false)
    const [error, setError] = useState(null)
    const [editMode, setEditMode] = useState(false)
    const [save, setSaving] = useState(false)
    const [subsiteSaving, setSubsiteSaving ] = useState(false)
    const [custInfo, setCustInfo] = useState(null)
    const [subsites, setSubsites ] = useState([])
    const [showSubsiteForm, setShowSubsiteForm ] = useState(false)
    const [editingSubsite, setEditingSubsite ] = useState(null)
    const [subsiteForm, setSubsiteForm] = useState({
            customer_id: id,
            address: '',
            city: '',
            state: '',
            zip: '',
            notes: '',
            contact: '',
            phone: '',
            lat: undefined,
            long:undefined,
            name:''
        })

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true)
                const [customerData, allIncidents, subsiteData] = await Promise.all([
                    getCustomer(id),
                    getIncidents(),
                    getSubsites(id)
                ])
                setCustomer(customerData)
                setCustInfo(customerData)
                setSubsites(subsiteData)
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
    
    const loadSubsites = async(id) =>{
        setSubsiteLoading(true);
            setError(null);
            try {
                const data = await getSubsites(id);
                setSubsites(data)
            } catch (error) {
                console.error('Error loading subsites', error)
                setError('Failed to load subsites, Please try again')
            }finally{
                setSubsiteLoading(false)
            }
        }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setCustInfo(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSubsiteChange = (e) =>{
        const { name, value, type, checked } = e.target
        setSubsiteForm(prev => ({...prev, [name]: type === 'checkbox' ? checked: value}))
    }

    const handleSubsiteUpdateChange = (e) => {
        const { name, value } = e.target
        setEditingSubsite(prev => ({ ...prev, [name]: value }))
    }
    
    const handleSave = async () => {
        try {
            setSaving(true)
            const updated = await updateCustomer(id, custInfo)
            setCustomer(updated)
            setEditMode(false)
        } catch (error) {
            setError(`Failed to update customer:${error.message}`)
        }finally{
            setSaving(false)
        }
    }
    const handleSubsiteSubmit = async (subsiteInfo) => {
        try {
            setSubsiteSaving(true)
            await createSubsite(subsiteInfo)
            loadSubsites(id)
        } catch (error) {
            setError(`Failed to create subsite: ${error.message}`)
        }finally{
            setSubsiteSaving(false)
            setShowSubsiteForm(false)
        }
    }

    const handleSubsiteUpdate = async (subsite_id, updateInfo) => {
        try {
            setSubsiteSaving(true)
            await updateSubsite(subsite_id, updateInfo)
            loadSubsites(id)
        } catch (error) {
            setError(`Failed to update subsite: ${error.message}`)
        }finally{
            setSubsiteSaving(false)
        }
    }

    const handleSubsiteDeactivate = async (subsite_id) => {
        try {
            setSubsiteSaving(true)
            await deactivateSubsite(subsite_id)
            loadSubsites(id)
        } catch (error) {
            setError(`Failed to deactivate subsite: ${error.message}`)
        }finally{
            setSubsiteSaving(false)
        }
    }


    const toggleEdit = () => setEditMode(!editMode)
    const cancelEdit = () => {
        setCustInfo(customer)
        toggleEdit()
    }


    if (loading) return <div className="page-main"><NavBar /><div className="loading">Loading...</div></div>
    if (error) return <div className="page-main"><NavBar /><div className="error-banner">{error}</div></div>
    if (!customer) return <div className="page-main"><NavBar /><div className="error-banner">Customer not found.</div></div>

    const activeIncidents = incidents.filter(i => i.status !== 'complete')
    const completedIncidents = incidents.filter(i => i.status === 'complete')

    return (
        <div className="page-main">
            <NavBar />
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <button className="btn btn-sm btn-secondary" onClick={() => navigate(-1)}>← Back</button>
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
                        <p>{customer.address}</p>
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

                <div className='detail-card'>
                    <h3>Timeline:</h3>
                    <p><strong>Created By:</strong>{customer.created_by_name}</p>
                    <p><strong>Created:</strong>{new Date(customer.created_at).toLocaleString()}</p>
                    <p><strong>Updated:</strong>{new Date(customer.updated_at).toLocaleString()}</p>
                </div>
                    {customer.notes && (
                        <div className="detail-card detail-card-wide">
                            <h3>Notes</h3>
                            <p>{customer.notes}</p>
                        </div>
                    )}

                <SiteMap props={{mainLong: customer.long, mainLat: customer.lat, subsites: subsites}}/>
                </div>
                <div className="section">
                    <div className="section-header">
                        <h2>Active Incidents ({activeIncidents.length})</h2>
                    </div>
                    {activeIncidents.length === 0 ? (
                        <p className="empty-msg">No active incidents.</p>
                    ) : (
                        <div className='table-wrapper'>

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
                        </div>
                    )}
                </div>

                {completedIncidents.length > 0 && (
                    <div className="section">
                        <h2>Completed Incidents ({completedIncidents.length})</h2>
                        <div className='table-wrapper'>

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
                    </div>
                )}
                {editMode ? (
        <form className="form-card">
        <div className="form-section">
            <h3>Customer Details</h3>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" required value={custInfo.name} onChange={handleChange} placeholder='ACME'/>
            </div>

            <div className="form-group">
                <label htmlFor="dept">Department</label>
                <input type="text" name="dept" id="dept" required value={custInfo.dept} onChange={handleChange} placeholder='Police'/>
            </div>

            <div className="form-group">
                <label htmlFor="address">Address</label>
                <input type="text" name="address" id="address" required value={custInfo.address} onChange={handleChange} placeholder='123 Main St.'/>
            </div>
            
            <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" name="city" id="city" required value={custInfo.city} onChange={handleChange} placeholder='Anytown'/>
            </div>

            <div className="form-group">
                <label htmlFor="state">State</label>
                <input type="text" name="state" id="state" required value={custInfo.state} onChange={handleChange} placeholder='NJ'/>
            </div>
            
            <div className="form-group">
                <label htmlFor="zip">Zip Code</label>
                <input type='text' name="zip" id="zip" value={custInfo.zip} onChange={handleChange} placeholder='01234'/>
            </div>

            <div className="form-group">
                <label htmlFor="contact">Contact</label>
                <input type='text' name="contact" id="contact" value={custInfo.contact} onChange={handleChange} placeholder='John Smith'/>
            </div>
            <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type='tel' name="phone" id="phone" value={custInfo.phone} onChange={handleChange} placeholder='212-123-4567'/>
            </div>
            <div className="form-group">
                <label htmlFor="contract">Contract</label>
                <input type='checkbox' name="contract" id="contract" checked={custInfo.contract} onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label htmlFor="lat">Latitude</label>
                <input type='text' name="lat" id="lat"  value={custInfo.lat} onChange={handleChange} placeholder='41.087608536537'/>
            </div>
            <div className="form-group">
                <label htmlFor="long">Longitude</label>
                <input type='text' name="long" id="long"  value={custInfo.long} onChange={handleChange} placeholder='-73.993761493427'/>
            </div>
            <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea name="notes" id="notes" value={custInfo.notes} onChange={handleChange}></textarea>
            </div>
        </div>
        <div className="form-actions">
            <button onClick={()=> handleSave()} className="btn btn-primary" disabled={save}>
                {save ? 'Saving...' : 'Save Customer'}
            </button>
            <button className='btn btn-sm' onClick={()=> cancelEdit()}>Cancel</button>
        </div>
    </form>
            ):(
            <div className='action-buttons'> 
                <button className='btn btn-sm' onClick={()=> toggleEdit()}>Edit Customer</button>
            </div>
            )}
        <SubsiteTable subsites = {subsites} subsiteForm={subsiteForm} handleSubsiteChange={handleSubsiteChange} handleSubsiteSubmit={handleSubsiteSubmit}
                        handleSubsiteUpdate={handleSubsiteUpdate} handleSubsiteDeactivate={handleSubsiteDeactivate} showSubsiteForm={showSubsiteForm}
                        setShowSubsiteForm={setShowSubsiteForm} editingSubsite={editingSubsite} setEditingSubsite={setEditingSubsite} subsiteLoading={subsiteLoading} 
                        subsiteSaving={subsiteSaving} handleSubsiteUpdateChange={handleSubsiteUpdateChange}/>
            </div>
        </div>
    )
}

function SubsiteTable({subsites, subsiteForm, handleSubsiteChange, handleSubsiteSubmit, showSubsiteForm, setShowSubsiteForm, subsiteLoading, subsiteSaving}){
                            if (subsiteLoading) return <div className="loading">Loading subsites...</div>
                            return(
                                <div className='subsite-content'>
            <div className='subsite-header'>
                <button onClick={() => setShowSubsiteForm(!showSubsiteForm)}>Create Subsite</button>
            </div>
                {showSubsiteForm && <div className='subsite-form'>
                    <form className='form-card' onSubmit={(e) => { e.preventDefault(); handleSubsiteSubmit(subsiteForm) }}>
                        <div className='form-section'>
                            <h3>Subsite Details</h3>
                            <div className='form-group'>
                                <label htmlFor="name">Name</label>
                                <input type="text" name='name' id='subsiteName' required value={subsiteForm.name} onChange={handleSubsiteChange}/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor="address">Address</label>
                                <input type="text" name='address' id='subsiteAddress' required value={subsiteForm.address} onChange={handleSubsiteChange}/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor="city">City</label>
                                <input type="text" name='city' id='subsiteCity' required value={subsiteForm.city} onChange={handleSubsiteChange}/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor="state">State</label>
                                <input type="text" name='state' id='subsiteState' required value={subsiteForm.state} onChange={handleSubsiteChange}/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor="zip">Zip</label>
                                <input type="text" name='zip' id='subsiteZip' required value={subsiteForm.zip} onChange={handleSubsiteChange}/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor="contact">Contact</label>
                                <input type="text" name='contact' id='subsiteContact' required value={subsiteForm.contact} onChange={handleSubsiteChange}/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor="phone">Phone</label>
                                <input type="text" name='phone' id='subsitePhone' required value={subsiteForm.phone} onChange={handleSubsiteChange}/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor="lat">Lat</label>
                                <input type="text" name='lat' id='subsiteLat' value={subsiteForm.lat} onChange={handleSubsiteChange}/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor="long">Long</label>
                                <input type="text" name='long' id='subsiteLong' value={subsiteForm.long} onChange={handleSubsiteChange}/>
                            </div>
                            <div className='form-group'>
                                <label htmlFor="notes">Notes</label>
                                <textarea name="notes" id="subsiteNotes" value={subsiteForm.notes} onChange={handleSubsiteChange}></textarea>
                            </div>
                            <div className='form-actions'>
                                <button type="submit" className="btn btn-primary" disabled={subsiteSaving}>
                                    {subsiteSaving ? 'Creating...' : 'Create Subsite'}
                                </button>
                                <button type="button" className="btn btn-sm" disabled={subsiteSaving} onClick={() => setShowSubsiteForm(!showSubsiteForm)}>Cancel</button>
                            </div>
                        </div>
                    </form>
                    
                    </div>}
                { subsites.length === 0 ? <p className='empty-msg'>No Subsites Found.</p>:
        <div className='table-wrapper'>
            <table className='data-table'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>State</th>
                        <th>Contact</th>
                        <th>Phone</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {subsites.map(s =>(
                        <tr key={s.id}>
                            <td>{s.name}</td>
                            <td>{s.address}</td>
                            <td>{s.city}</td>
                            <td>{s.state}</td>
                            <td>{s.contact}</td>
                            <td>{s.phone}</td>
                            <td><Link to={`/subsite/${s.id}`} className='btn btn-sm'>View</Link></td>
                            
                        </tr>
                            ))}
                </tbody>
            </table>
        </div>
                }
        </div>
    )
}