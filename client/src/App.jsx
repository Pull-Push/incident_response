import { BrowserRouter, Routes, Route } from 'react-router-dom'
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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/customers' element={<Customers />} />
        <Route path='/customers/:id' element={<IndyCustomer />} />
        <Route path='/incidents' element={<Incidents />} />
        <Route path='/incidents/:id' element={<IndyIncident />} />
        <Route path='/create/customer' element={<CustomerCreate />} />
        <Route path='/create/incident' element={<IncidentCreate />} />
        <Route path='/users' element={<Users />} />
        <Route path='/users/:id' element={<IndyUser />} />
        {/* <Route path='*' element={<NotFound />} />  */}
      </Routes>
    </BrowserRouter>
  )
}

export default App