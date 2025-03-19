import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';
import assets from '../../assets/assets';

const MyOrders = () => {

  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([])
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id')

  const fetchOrders = async () => {
    const response = await axios.get(url + "/api/order/" + orderId, {}, { headers: { token } });
    console.log(response.data)
    setData(response.data.data.reverse())

  }

  // useEffect(() => {
  //   if (token) {
  //     fetchOrders();
  //   }
  // }, [token])

  useEffect(() => {
    fetchOrders();
  }, [])


  return (
    <div className='my-orders'>
      <h2>Giỏ hàng của tôi</h2>
      <div className="container">
        {data.map((order, index) => {
          return (
            <div key={index} className='my-orders-order'>
              <img src={assets.parcel_icon} alt="" />
              <p>{order.items.map((item) => {
                const product = order.products.find(prod => prod._id === item._id);
                return (<div><span>{product.name + " x " + item.quantity}</span> </div> )
              })}</p>
              <p>${order.amount}.00</p>
              <p>Items: {order.items.length}</p>
              <p><span>&#x25cf;</span> <b>{order.status}</b></p>
              <button onClick={fetchOrders}>Track Order</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MyOrders
