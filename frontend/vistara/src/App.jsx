import React from 'react'
import {  BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import './App.css'
import Signin from './pages/login'
import Register from './pages/register'


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Signin/>}/>
          <Route path='/register' element={<Register/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
