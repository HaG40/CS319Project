// App.tsx - Updated with ViewParticipantsPage route
import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Header from './components/Header'
import User from './components/User'
import Login from './components/Login'
import Register from './components/Register'
import { ToastContainer } from 'react-toastify';
import AbountUs from './components/AboutUs'
import Footer from './components/Footer'
import { useUserStore } from './store/userStore'
import UserManager from './components/Administrator/UserManager'
import CreateActivity from './components/Administrator/CreateActivity'
import AdminLandingPage from './components/Administrator/AdminLandingPage'
import ViewParticipants from './components/Administrator/ViewParticipants'

function App() {
  
  const { user } = useUserStore();

  return (
    <>
    <Header/>
    <div className=''>
      <Routes>
        {user?.role === "admin" ? <Route path='/' element={<AdminLandingPage/>}/> : <Route path='/' element={<LandingPage/>}/>}
        <Route path='/category/:category' element={<LandingPage/>}/>
        {user?.role === "user" && <Route path='/user' element={<User/>}/>}
        <Route path='/user/login' element={<Login/>}/>
        <Route path='/user/register' element={<Register/>}/>
        <Route path='/about' element={<AbountUs/>}/>
        {user?.role === "admin" && <Route path='/user/manager' element={<UserManager/>}/>}
        {user?.role === "admin" && <Route path='/post' element={<CreateActivity/>}/>}
        {user?.role === "admin" && <Route path='/admin/participants/:activityId' element={<ViewParticipants/>}/>}
      </Routes>
    </div>
    <Footer/>

    
    <ToastContainer
        position="bottom-center"
        autoClose={2500}
        closeOnClick
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App