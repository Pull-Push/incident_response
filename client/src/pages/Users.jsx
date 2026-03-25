import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import NavBar from '../components/NavBar'
import {getUsers, createUser } from '../services/api'

export default function Users(){
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState({
            first_name: '',
            last_name: '',
            position: '',
            is_manager: false,
            is_sales: false,
            is_service: false,
            employee_number: '',
            email: '',
            password: ''
        })

    useEffect(()=>{
        loadUsers()
    },[])
        
    const loadUsers = async() =>{
        setLoading(true);
            setError(null);
            try {
                const data = await getUsers();
                setUsers(data)
            } catch (error) {
                console.error('Error loading Users', error)
                setError('Failed to load Users, Please try again')
            }finally{
                setLoading(false)
            }
        }
    const resetForm = () =>{
        setForm({
            first_name: '',
            last_name: '',
            position: '',
            is_manager: false,
            is_sales: false,
            is_service: false,
            employee_number: '',
            email: '',
            password: ''
        })
    }
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null);
        setSubmitting(true);
        try {
            await createUser(form)
            loadUsers()
            resetForm()
        } catch (err) {
            setError('Failed to create user. Please try again.')
            console.error(err)
        } finally {
            setSubmitting(false)
        }
    }
    const toggleCreateUser = () => setShowForm(!showForm)


    return(
        <div className='userPageMain'>
            <NavBar />
            <div className='userPage-content'>
                <div className='userPage-header'>
                    <h1>Users</h1>
                    <button className="btn btn-primary" onClick={() => toggleCreateUser()}>+ Create User</button>
                </div>
                {showForm && <div className="user-form"><h2>USER FORM GOES HERE!!</h2></div>}
                {error && <div className="error-banner">{error}</div>}
                {loading && <div className="loading">Loading users...</div>}
                <UserTable users={users} />
            </div>
        </div>
    )
}

function UserTable({users}){
    if(users.length === 0) return <p className='empty-msg'>No Users Found.</p>
    return(
        <table className='data-table'>
            <thead>
                <tr>
                    <th>Employee Number</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Position</th>
                    <th>Manager</th>
                    <th>Sales</th>
                    <th>Service</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>View</th>
                </tr>
            </thead>
            <tbody>
                {users.map(user => (
                    <tr key={user.id}>
                        <td>#{user.employee_number}</td>
                        <td>{user.first_name}</td>
                        <td>{user.last_name}</td>
                        <td>{user.position}</td>
                        <td>{user.is_manager ? '✅' : '—'}</td>
                        <td>{user.is_sales ? '✅' : '—'}</td>
                        <td>{user.is_service ? '✅' : '—'}</td>
                        <td>{user.email}</td>
                        <td>{user.is_valid ? '✅' : '—'}</td>
                        <td><Link to={`/users/${user.id}`} className='btn btn-sm'>View</Link></td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}