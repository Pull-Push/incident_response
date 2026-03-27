import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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
                {showForm && <div className="user-form">
                <form className="form-card" onSubmit={handleSubmit}>
        <div className="form-section">
            <h3>User Details</h3>
            <div className="form-group">
                <label htmlFor="employee_number">Employee Number</label>
                <input type="text" name="employee_number" id="employee_number" required value={form.employee_number} onChange={handleChange}/>
            </div>

            <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input type="text" name="first_name" id="first_name" required value={form.first_name} onChange={handleChange} placeholder='John'/>
            </div>

            <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input type="text" name="last_name" id="last_name" required value={form.last_name} onChange={handleChange} placeholder='Smith'/>
            </div>
            <div className="form-group">
                <label htmlFor="position">Position</label>
                <input type="text" name="position" id="position" required value={form.position} onChange={handleChange} placeholder='Sales'/>
            </div>

            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" name="email" id="email" required value={form.email} onChange={handleChange} placeholder='JSmith@company.com'/>
            </div>
            <div className="form-group">
                <label htmlFor="is_manager">Manager</label>
                <input type='checkbox' name="is_manager" id="is_manager" checked={form.is_manager} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="is_sales">Sales</label>
                <input type='checkbox' name="is_sales" id="is_sales" checked={form.is_sales} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="is_service">Service</label>
                <input type='checkbox' name="is_service" id="is_service" checked={form.is_service} onChange={handleChange}/>
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type='password' name="password" id="password" required value={form.password} onChange={handleChange}/>
            </div>
        </div>
        <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Creating...' : 'Create User'}
            </button>
        </div>
    </form>    
                </div>}
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