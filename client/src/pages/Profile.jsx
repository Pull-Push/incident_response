import { useContext } from "react";
import NavBar from "../components/NavBar"
import { AuthContext } from "../context/AuthContext";


export default function Profile(){
    const { currentUser } = useContext(AuthContext)
    if(!currentUser) return <div className="page-main"><NavBar/><div className="loading">Loading...</div></div>
    return(
        <div className="profile-main">
            <NavBar/>
            <div className="page-content">
            <h1>User Profile</h1>
            <p><strong>Employee Number:</strong> {currentUser.employee_number}</p>
            <p><strong>First Name:</strong> {currentUser.first_name}</p>
            <p><strong>Last Name:</strong> {currentUser.last_name}</p>
            <p><strong>Position:</strong> {currentUser.position}</p>
            <p><strong>Manager:</strong> {currentUser.is_manager ? 'Yes' : 'No'}</p>
            <p><strong>Sales:</strong> {currentUser.is_sales ? 'Yes' : 'No'}</p>
            <p><strong>Service:</strong> {currentUser.is_service ? 'Yes' : 'No'}</p>
            <p><strong>Email:</strong> {currentUser.email}</p>
            <p><strong>Phone Number:</strong> {currentUser.phone}</p>
            <p><strong>Created:</strong> {new Date(currentUser.created_at).toLocaleString()}</p>
            <p><strong>Updated:</strong> {new Date(currentUser.updated_at).toLocaleString()}</p>
            </div>
        </div>
    )
}