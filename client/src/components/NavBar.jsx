import {Link, useNavigate } from "react-router-dom"

export default function NavBar(){
    const navigate = useNavigate()

    const logOut = () =>{
        localStorage.removeItem('token')
        navigate('/')
    }
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
                <Link to={'/users'}>Users</Link>
                <button className="btn btn-small" onClick={()=>{logOut()}}>Log Out</button>
            </div>
        </div>
    )
}