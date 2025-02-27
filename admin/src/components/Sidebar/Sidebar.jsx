import React from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className="sidebar-options">
        <NavLink to='/add' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Recipe</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Recipe</p>
        </NavLink>
        <NavLink to='/add_product' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Product</p>
        </NavLink>
        <NavLink to='/list_product' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>List Product</p>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar