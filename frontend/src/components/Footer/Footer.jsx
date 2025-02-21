import React from 'react'
import './Footer.css'
import assets from '../../assets/assets'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    {/* <img src={assets.logo} alt="" /> */}
                    <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates deleniti necessitatibus expedita officiis assumenda eaque corrupti incidunt eum id. Commodi alias aut illo. Ullam nesciunt harum cum dignissimos sed consequatur!</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <img src={assets.twitter_icon} alt="" />
                        <img src={assets.linkedin_icon} alt="" />
                    </div>
                </div>
                <div className="footer-content-center">
                    {/* <h2>COMPANY</h2>
                    <ul>
                        <li>Home</li>
                        <li>About us</li>
                        <li>Delivery</li>
                        <li>Privacy policy</li>
                    </ul> */}
                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+84-868-470-229</li>
                        <li>lambaluan2609@gmail.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className="footer-copyright">
                Copyright 2024 © Cook&Carry - All Rights Reserved.
            </p>
        </div>
    )
}

export default Footer