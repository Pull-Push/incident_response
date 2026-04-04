import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"

export default function NavBar() {
    const navigate = useNavigate()
    const { setCurrentUser } = useContext(AuthContext)
    const [ isOpen, setIsOpen ] = useState(false)

    const logOut = () => {
        localStorage.removeItem('token')
        setCurrentUser(null)
        navigate('/')
    }

    const closeMenu = () => setIsOpen(false)
    return (
        <div className="navbarMain">
            <div className="navLeft">
                <span className="nav-brand">ICR</span>
            </div>
            <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
                <span></span>
                <span></span>
                <span></span>
            </button>
            <div className={` navRight ${isOpen ? 'navRight--open': ''}`}>
                <Link to="/dashboard" onClick={closeMenu}>Dashboard</Link>
                <Link to="/customers" onClick={closeMenu}>Customers</Link>
                <Link to="/incidents" onClick={closeMenu}>Incidents</Link>
                <Link to="/users" onClick={closeMenu}>Users</Link>
                <Link to="/profile" onClick={closeMenu}>Profile</Link>
                <button className="btn-small" onClick={logOut}>Log Out</button>
            </div>
        </div>
    )
}
