import {Link } from "react-router-dom"

export default function NavBar(){
    return(
        <div className="navbarMain">
            <div className="navLeft">
                <img src="" alt="smallLogo" />
            </div>
            <div className="navRight">
                <Link to={'/dashboard'}>Dashboard</Link>
                <Link to={'/customers'}>Customers</Link>
                <Link to={'/incidents'}>Incidents</Link>
                <Link to={'/profile'}>Profile</Link>
            </div>
        </div>
    )
}