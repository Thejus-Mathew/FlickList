import { BrowserRouter, Route, Routes,Navigate } from 'react-router-dom'
import { useState,useEffect } from 'react'
import './App.css'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Dashboard from './Pages/Dashboard'
import { auth } from './firebase/configure'



function App() {

  const[user,setUser] = useState(null)

  useEffect(()=>{
    auth.onAuthStateChanged(async(user)=>{
      setUser(user)
    })
  },[])

  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={user?<Navigate to="/dashboard"/>:<Login/>} />
        <Route path='login' element={<Login/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/dashboard' element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
