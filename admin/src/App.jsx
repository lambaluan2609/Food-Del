import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Routes,Route, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {

    const url = import.meta.env.VITE_API_URL;

  return (
    <div>
        <ToastContainer />
        <Navbar/>
        <hr />
        <div className='app-content'>

        <Sidebar/>
        <Routes>
          <Route path='/add' element={<Add url={url}/>}/>
          <Route path='/list' element={<List url={url}/>}/>

           <Route path="*" element={<Navigate to="/" />} />
           
        </Routes>

        </div>
    </div>
  )
}

export default App
