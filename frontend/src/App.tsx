import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Header from './components/Header'
import User from './components/User'
import Login from './components/Login'
import Register from './components/Register'

function App() {
  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/category/:category' element={<LandingPage/>}/>
      <Route path='/user' element={<User/>}/>
      <Route path='/user/login' element={<Login/>}/>
      <Route path='/user/register' element={<Register/>}/>
    </Routes>
    </>
  )
}

export default App
