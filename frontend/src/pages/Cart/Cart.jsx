import React, {useContext} from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'
const Cart = () => {

  const { cartItems, productList, removeFromCart, cartAmount, deliveryFee } = useContext(StoreContext)

  const navigate = useNavigate();

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Mặt hàng</p>
          <p>Mô tả</p>
          <p>Giá</p>
          <p>Số lượng</p>
          <p>Total</p>
          {/* <p>Remove</p> */}
        </div>
        <br />
        <hr />
        {productList.map((item, index) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={index}>
                <div className='cart-items-title cart-items-item'>
                  <img src={item.image} alt="" />
                  <p>{item.name}</p>
                  <p>${item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>${item.price * cartItems[item._id]}</p>
                  <p onClick={() => removeFromCart(item._id)} className='cross'>x</p>
                </div>
                <hr />
              </div>
            )
          }
        })}
      </div>
      <div className="cart-bottom">
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
              <b>{cartAmount + deliveryFee}</b>
            </div>
          </div>
          <button onClick={() => navigate("/order")}>TIẾN HÀNH THANH TOÁN</button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>Nhập mã giảm giá ở đây:</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='Mã giảm giá' />
              <button>Nhập</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
