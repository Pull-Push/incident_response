import { logIn, getMe } from "../services/api";
import { useContext, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import mainLogo from "../assets/images/main_logo.png"

export default function Login() {
    const [error, setError] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [form, setForm] = useState({ email: '', password: '' })
    const navigate = useNavigate()
    const { setCurrentUser } = useContext(AuthContext)

    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setSubmitting(true)
        try {
            const data = await logIn(form)
            localStorage.setItem('token', data.token)
            const user = await getMe()
            setCurrentUser(user)
            navigate('/dashboard')
        } catch (err) {
            setError(err.message)
            console.error(err)
            setForm(prev => ({ ...prev, password: '' }))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <div className="page-main">
            <div className="login-container">
                <div className="login-logo">
                    <img src={mainLogo} alt="ICR" style={{ height:'120px', objectFit:'contain'}}/>
                    <div className="login-logo-sub">Incident Control & Response</div>
                </div>

                {error && <div className="error-banner">{error}</div>}

                <div className="login-card">
                    <h1>Sign in</h1>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="email">Email address</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                placeholder="you@company.com"
                                autoComplete="email"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                name="password"
                                id="password"
                                required
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>
                        <div className="form-actions" style={{ paddingTop: '16px', marginTop: '8px', borderTop: 'none' }}>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={submitting}>
                                {submitting ? 'Signing in...' : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
