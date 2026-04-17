import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import {
	getIndySubsite,
	updateSubsite,
	deactivateSubsite,
} from "../services/api";
import SiteMap from "../components/SiteMap";

export default function IndySubsite() {
	// PARAMS HAS TO MATCH WHAT IS PASSED TO ROUTE IN APP.JSX ie: <Route path='/subsite/:subsite_id'.... param has to be subsite_id
	const {subsite_id} = useParams(); 
	const navigate = useNavigate();
	const [subsite, setSubsite] = useState(null);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [subsiteInfo, setSubsiteInfo] = useState(null);

	useEffect(() => {
		const load = async () => {
			try {
				setLoading(true);
				const data = await getIndySubsite(subsite_id);
				setSubsite(data);
				setSubsiteInfo(data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};
		load();
	}, [subsite_id]);

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target;
		setSubsiteInfo((prev) => ({
			...prev,
			[name]: type === "checkbox" ? checked : value,
		}));
	};

	const handleSave = async () => {
		try {
			setSaving(true);
			const updated = await updateSubsite(subsite_id, subsiteInfo);
			setSubsite(updated);
			setEditMode(false);
		} catch (error) {
			setError(`Failed to update subsite:${error.message}`);
		} finally {
			setSaving(false);
		}
	};

    const handleDeactivate = async () => {
        if (!confirm('Deactivate this subsite?')) return
        try {
            setSaving(true)
            await deactivateSubsite(subsite_id)
            navigate(-1)
        } catch (error) {
            setError(`Failed to deactivate subsite: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }




	const toggleEdit = () => setEditMode(!editMode);
	
	const cancelEdit = () => {
		setSubsiteInfo(subsite);
		toggleEdit();
	};

	if (loading)
		return (
			<div className="page-main">
				<NavBar />
				<div className="loading">Loading...</div>
			</div>
		);
	if (error)
		return (
			<div className="page-main">
				<NavBar />
				<div className="error-banner">{error}</div>
			</div>
		);
	if (!subsite)
		return (
			<div className="page-main">
				<NavBar />
				<div className="error-banner">Subsite not found.</div>
			</div>
		);

	return (
		<div className="page-main">
			<NavBar />
			<div className="page-content">
				<div className="page-header">
					<div>
						<button
							className="btn btn-sm"
							onClick={() => navigate(-1)}
						>
							← Back
						</button>
						<h1>{subsite.name} Subsite</h1>
						<p className="subtitle">{subsite.customer}</p>
					</div>
				</div>

					<div className="detail-grid">
						<div className="detail-card">
							<h3>Address:</h3>
							<p>{subsite.address}</p>
							<p>{subsite.city}</p>
							<p>{subsite.state}</p>
							<p>{subsite.zip}</p>
							<p><strong>Lat:</strong> {subsite.lat}</p>
							<p><strong>Long:</strong> {subsite.long}</p>
						</div>
						<div className="detail-card">
							<h3>Contact Information</h3>
							<p>{subsite.contact}</p>
							<p>{subsite.phone}</p>
						</div>

                        {subsite.notes && <div className="detail-card detail-card-wide">
                            <h3>Subsite Notes</h3>
                            <p>{subsite.notes}</p>
                        </div>}
					</div>
				<SiteMap mainLong={subsite.long} mainLat={subsite.lat}/>
				{editMode ? (
        <form className="form-card">
        <div className="form-section">
            <h3>Subsite Details</h3>
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input type="text" name="name" id="name" required value={subsiteInfo.name} onChange={handleChange} placeholder='ACME'/>
            </div>

            <div className="form-group">
                <label htmlFor="address">Address</label>
                <input type="text" name="address" id="address" required value={subsiteInfo.address} onChange={handleChange} placeholder='123 Main St.'/>
            </div>
            
            <div className="form-group">
                <label htmlFor="city">City</label>
                <input type="text" name="city" id="city" required value={subsiteInfo.city} onChange={handleChange} placeholder='Anytown'/>
            </div>

            <div className="form-group">
                <label htmlFor="state">State</label>
                <input type="text" name="state" id="state" required value={subsiteInfo.state} onChange={handleChange} placeholder='NJ'/>
            </div>
            
            <div className="form-group">
                <label htmlFor="zip">Zip Code</label>
                <input type='text' name="zip" id="zip" value={subsiteInfo.zip} onChange={handleChange} placeholder='01234'/>
            </div>

            <div className="form-group">
                <label htmlFor="contact">Contact</label>
                <input type='text' name="contact" id="contact" value={subsiteInfo.contact} onChange={handleChange} placeholder='John Smith'/>
            </div>
            <div className="form-group">
                <label htmlFor="phone">Phone</label>
                <input type='tel' name="phone" id="phone" value={subsiteInfo.phone} onChange={handleChange} placeholder='212-123-4567'/>
            </div>

            <div className="form-group">
                <label htmlFor="lat">Latitude</label>
                <input type='text' name="lat" id="lat"  value={subsiteInfo.lat} onChange={handleChange} placeholder='41.087608536537'/>
            </div>
            <div className="form-group">
                <label htmlFor="long">Longitude</label>
                <input type='text' name="long" id="long"  value={subsiteInfo.long} onChange={handleChange} placeholder='-73.993761493427'/>
            </div>
            <div className="form-group">
                <label htmlFor="notes">Notes</label>
                <textarea name="notes" id="notes" value={subsiteInfo.notes} onChange={handleChange}></textarea>
            </div>
        </div>
        <div className="form-actions">
            <button onClick={()=> handleSave()} className="btn btn-primary" disabled={saving}>
                {saving ? 'Saving...' : 'Save Subsite'}
            </button>
            <button className='btn btn-sm' onClick={()=> cancelEdit()}>Cancel</button>
        </div>
    </form>
            ):(
            <div className='action-buttons'> 
                <button className='btn btn-sm' onClick={()=> toggleEdit()}>Edit Subsite</button>
				<button className='btn btn-sm' onClick={handleDeactivate}>Deactivate Subsite</button>
            </div>
            )}
			</div>
		</div>
	);
}
