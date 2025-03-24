import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import QRCodePage from './pages/ZaloQRCode/qrCode.jsx'
import RecipeDetails from './pages/RecipeDetails/RecipeDetails.jsx'
import SearchResults from './pages/SearchResults/SearchResults.jsx'
import ProductPage from './pages/ProductPage/ProductPage.jsx'
import ProductDetail from './pages/ProductDetail/ProductDetail.jsx'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const App = () => {

  const [showLogin, setShowLogin] = useState(false)

  return (
    <>
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} /> : <></>}
      <div>
        <ToastContainer />
        <div className="app">
          <Navbar setShowLogin={setShowLogin} />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/detail/:id' element={<RecipeDetails />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/order' element={<PlaceOrder />} />
            <Route path='/verify' element={<Verify />} />
            <Route path='/qrcode' element={<QRCodePage />} />
            <Route path='/myorders' element={<MyOrders />} />
            <Route path='/search' element={<SearchResults />} />
            <Route path='/product' element={<ProductPage />} />
            <Route path="/product/detail/:id" element={<ProductDetail />} />
            <Route path="*" element={<Navigate to="/" />} />

          </Routes>
        </div>
        <Footer />
      </div>
    </>

  )
}

export default App
