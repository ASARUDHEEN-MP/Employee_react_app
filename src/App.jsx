import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from "react-router-dom";
import Login from './Components/Auth_control/Login';
import Signup from './Components/Auth_control/Signup';
import User_dashbord from './Components/User_managment/User_dashbord';
import { Context } from './Context';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Context>
    <Routes>
      <Route path='/Login' element={<Login/>}/>
      <Route path='/Signup' element={<Signup/>}/>
      <Route path='/' element={<User_dashbord/>}/>
    </Routes>
    </Context>
  )
}

export default App
