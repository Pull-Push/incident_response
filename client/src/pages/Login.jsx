import { logIn, getMe } from "../services/api";
import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";


export default function Login(){
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm ] = useState({
        email: '',
        password: '',
    })
    const navigate = useNavigate()
    const { setCurrentUser } = useContext(AuthContext) 

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    }

        const handleSubmit = async (e) => {
            e.preventDefault()
            setError(null);
            setSubmitting(true);
            try {
                const data = await logIn(form)
                localStorage.setItem('token', data.token)
                const user = await getMe()
                setCurrentUser(user)
                navigate('/dashboard')
            } catch (err) {
                setError('Failed to Log In. Please try again.')
                console.error(err)
                resetForm()
            } finally {
                setSubmitting(false)
            }
        }
        const resetForm = () =>{
            setForm({
                email: '',
                password: ''
            })
        }
    return(
        <div className="page-main">
            <div className="page-content">
                <div className="page-upper">
                    <img src="" alt="ICR LOGO" />
                </div>
                <div className="page-lower">
                    {error && <div className="error-banner">{error}</div>}
                    <form className="form-card" onSubmit={handleSubmit}>
                    <div className="form-section">
                        <h1>Log In</h1>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input type="email" name="email" id="email" required value={form.email} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input type="password" name="password" id="password" required value={form.password} onChange={handleChange}/>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn btn-primary" disabled={submitting}>
                                {submitting ? 'Logging In...' : 'Log In'}
                            </button>
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    )
}