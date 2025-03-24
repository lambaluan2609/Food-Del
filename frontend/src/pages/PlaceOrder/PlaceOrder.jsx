import React, { useContext, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const PlaceOrder = () => {

  const { cartAmount, token, productList, cartItems, url, deliveryFee } = useContext(StoreContext)

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    country: "",
    phone: ""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = []
    productList.map((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          _id: item._id,
          quantity: cartItems[item._id],
        })
      }
    })
    let orderData = {
      orderInfo: data,
      items: orderItems,
      deliveryFee: deliveryFee,
      cartAmount: cartAmount,
    }
    let response = await axios.post(url + "/api/order/place", orderData, { headers: { token } })
    if (response.data.success) {
      console.log(response.data)
      const { orderId } = response.data;
      navigate(`/myorders?order_id=${orderId}`)
      // window.location.replace(session_url)
    }
    else {
      alert("Error")
    }
  }

  const navigate = useNavigate();

  // useEffect(() => {
  //   if (!token) {
  //     navigate('/cart')
  //   }
  //   else if (cartAmount === 0) {
  //     navigate('/cart')
  //   }
  // }, [token])

  return (
    <form onSubmit={placeOrder} className="place-order">
      <div className="place-order-left">
        <p className="title">Thông tin vận chuyển</p>
        <div className="multi-fields">
          <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='Họ' />
          <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Tên' />
        </div>
        <input required name='email' onChange={onChangeHandler} value={data.email} type="text" placeholder='Địa chỉ email' />
        <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className="multi-fields">
          <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='Tỉnh/thành' />
          <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='Quận/huyện' />
        </div>
        {/* <div className="multi-fields">
          <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='Zip code' />
          <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Country' />
        </div> */}
        <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Số điện thoại' />
      </div>
      <div className="place-order-right">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>{cartAmount} ₫</p>
            </div>
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>{deliveryFee} ₫</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <b>Total</b>
              <b>{cartAmount + deliveryFee} ₫</b>
            </div>
          </div>
          <button type='submit' >HOÀN TẤT THANH TOÁN</button>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
