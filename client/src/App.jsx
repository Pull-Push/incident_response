import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Incidents from './pages/Incidents'
import CustomerCreate from './pages/CustomerCreate'
import IncidentCreate from './pages/IncidentCreate'
import IndyCustomer from './pages/IndyCustomer'
import IndyIncident from './pages/IndyIncident'
import './App.css'
import Users from './pages/Users'
import IndyUser from './pages/IndyUser'
import Login from './pages/Login'
import Profile from './pages/Profile'
import AuthProvider from './context/AuthProvider'

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path='/customers' element={<ProtectedRoute><Customers /></ProtectedRoute>} />
        <Route path='/customers/:id' element={<ProtectedRoute><IndyCustomer /></ProtectedRoute>} />
        <Route path='/incidents' element={<ProtectedRoute><Incidents /></ProtectedRoute>} />
        <Route path='/incidents/:id' element={<ProtectedRoute><IndyIncident /></ProtectedRoute>} />
        <Route path='/create/customer' element={<ProtectedRoute><CustomerCreate /></ProtectedRoute>} />
        <Route path='/create/incident' element={<ProtectedRoute><IncidentCreate /></ProtectedRoute>} />
        <Route path='/users' element={<ProtectedRoute><Users /></ProtectedRoute>} />
        <Route path='/users/:id' element={<ProtectedRoute><IndyUser /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        {/* <Route path='*' element={<NotFound />} />  */}
      </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App