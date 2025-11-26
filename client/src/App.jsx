import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import './App.css'
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path='/customers' element={<Customers />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
