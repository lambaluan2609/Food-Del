/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {QRCodeSVG} from 'qrcode.react';
import axios from "axios";
import {StoreContext} from "../../context/StoreContext.jsx";
import "./qrCode.css"
import assets from '../../assets/assets.js';

const QRCodePage = () => {

    const [searchParams] = useSearchParams();
    const orderUrl = searchParams.get('order_url')
    const orderId = searchParams.get('order_id')
    const navigate = useNavigate();

    const {url} = useContext(StoreContext)

    const fetchData = async () => {
        try {
            const response = await axios.get(url+`/api/order/zalo/payment-check?order_id=${orderId}`);
            if(response.data.success) {
                navigate("/myorders");
            }
        } catch (err) {
            console.error("Check payment process failed!")
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000); // 5000 ms = 5 seconds

        // Clear the interval on component unmount
        return () => clearInterval(interval);
    }, [])

    return (
        <div className='qr-code'>
            <div className='payment-process'>
                <h1>Scan this QR Code on your phone to payment</h1>
            </div>
            <div className="imgLogo">
                <img src={assets.zaloPayLogo} alt="" />
                <img src={assets.zaloLogo} alt="" />
            </div>
            <QRCodeSVG className='qrcodeSVG' value={orderUrl} size={256}/>
            
        </div>
    )
}

export default QRCodePage
