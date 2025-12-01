import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import CreateCustomer from './pages/CustomerCreate'
import './App.css'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
          <Route path='/dashboard' element={<Dashboard />}/>
          <Route path='/customers' element={<Customers />}/>
          <Route path='/create/customer' element={<CreateCustomer />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
