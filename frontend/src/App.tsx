import './App.css'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import Header from './components/Header'

function App() {
  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
    </Routes>
    </>
  )
}

export default App
