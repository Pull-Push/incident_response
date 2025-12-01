import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Incidents from './pages/Incidents'
import CreateCustomer from './pages/CustomerCreate'
import CreateIncident from './pages/IncidentCreate'
import './App.css'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/customers' element={<Customers />}/>
          <Route path='/incidents' element={<Incidents />}/>
          <Route path='/create/customer' element={<CreateCustomer />} />
          <Route path='/create/incident' element={<CreateIncident />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
