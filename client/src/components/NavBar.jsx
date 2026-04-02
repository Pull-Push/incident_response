import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function NavBar() {
    const navigate = useNavigate()
    const { setCurrentUser } = useContext(AuthContext)

    const logOut = () => {
        localStorage.removeItem('token')
        setCurrentUser(null)
        navigate('/')
    }

    return (
        <div className="navbarMain">
            <div className="navLeft">
                <span className="nav-brand">ICR</span>
            </div>
            <div className="navRight">
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/customers">Customers</Link>
                <Link to="/incidents">Incidents</Link>
                <Link to="/profile">Profile</Link>
                <Link to="/users">Users</Link>
                <button className="btn-small" onClick={logOut}>Log Out</button>
            </div>
        </div>
    )
}
