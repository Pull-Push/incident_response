import { useContext } from "react";
import NavBar from "../components/NavBar"
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
    const { currentUser } = useContext(AuthContext)
    if (!currentUser) return <div className="page-main"><NavBar /><div className="loading">Loading...</div></div>

    return (
        <div className="page-main">
            <NavBar />
            <div className="page-content">
                <div className="page-header">
                    <div>
                        <h1>{currentUser.first_name} {currentUser.last_name}</h1>
                        <p className="subtitle">{currentUser.position} · #{currentUser.employee_number}</p>
                    </div>
                    <div className="header-actions">
                        {currentUser.is_manager && <span className="badge badge-active">Manager</span>}
                        {currentUser.is_sales && <span className="badge badge-contract">Sales</span>}
                        {currentUser.is_service && <span className="badge badge-complete">Service</span>}
                    </div>
                </div>

                <div className="detail-grid">
                    <div className="detail-card">
                        <h3>Contact</h3>
                        <p><strong>Email</strong></p>
                        <p>{currentUser.email}</p>
                        {currentUser.phone && (
                            <>
                                <p style={{ marginTop: '10px' }}><strong>Phone</strong></p>
                                <p>{currentUser.phone}</p>
                            </>
                        )}
                    </div>

                    <div className="detail-card">
                        <h3>Role & Access</h3>
                        <p>Manager: {currentUser.is_manager ? '✅ Yes' : '—'}</p>
                        <p>Sales: {currentUser.is_sales ? '✅ Yes' : '—'}</p>
                        <p>Service: {currentUser.is_service ? '✅ Yes' : '—'}</p>
                    </div>

                    <div className="detail-card">
                        <h3>Account</h3>
                        <p><strong>Status</strong></p>
                        <p>{currentUser.is_valid ? '✅ Active' : '⚠️ Inactive'}</p>
                        <p style={{ marginTop: '10px' }}><strong>Employee #</strong></p>
                        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>{currentUser.employee_number}</p>
                    </div>

                    <div className="detail-card">
                        <h3>Timeline</h3>
                        <p><strong>Member since</strong></p>
                        <p>{new Date(currentUser.created_at).toLocaleDateString()}</p>
                        <p style={{ marginTop: '10px' }}><strong>Last updated</strong></p>
                        <p>{new Date(currentUser.updated_at).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
