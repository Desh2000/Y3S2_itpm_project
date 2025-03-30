import React from 'react'
import {  BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import Signin from './pages/login'
import Register from './pages/register'
import Dashboard from './pages/dashboard'
import Users from './pages/users'
import Profile from './pages/profile'
import Userdashboard from './pages/user-dashboard'


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/dashboard' element={<Userdashboard/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
