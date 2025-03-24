import React from 'react'
import './Footer.css'
import assets from '../../assets/assets'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    <img src={assets.logo1} alt="" />
                    {/* <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Voluptates deleniti necessitatibus expedita officiis assumenda eaque corrupti incidunt eum id. Commodi alias aut illo. Ullam nesciunt harum cum dignissimos sed consequatur!</p> */}
                    <div className="footer-social-icons">
                        <img
                            src={assets.facebook_icon}
                            alt="Facebook"
                            onClick={() => window.open("https://www.facebook.com/profile.php?id=61572193500522", "_Cook&Carry")}
                            style={{ cursor: 'pointer' }}
                        />
                        {/* <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <img src={assets.twitter_icon} alt="Twitter" />
                        </a>
                        <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer">
                            <img src={assets.linkedin_icon} alt="LinkedIn" />
                        </a> */}
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
                    <h2>LIÊN HỆ</h2>
                    <ul>
                        <li>+84-868-470-229</li>
                        <li>lambaluan2609@gmail.com</li>
                        <li>haidang12112002@gmail.com</li>
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