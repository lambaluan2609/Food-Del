import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  const { cartAmount, token, productList, cartItems, url, deliveryFee } = useContext(StoreContext);
  const navigate = useNavigate();

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    productList.forEach((item) => {
      if (cartItems[item._id] > 0) {
        orderItems.push({
          _id: item._id,
          quantity: cartItems[item._id],
        });
      }
    });

    if (orderItems.length === 0) {
      toast.error("Giỏ hàng trống, không thể đặt hàng!");
      return;
    }

    const orderData = {
      orderInfo: data,
      items: orderItems,
      deliveryFee: deliveryFee,
      cartAmount: cartAmount,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, {
        headers: { token },
      });
      if (response.data.success) {
        const { orderId } = response.data;
        toast.success(`Đơn hàng ${orderId} đã được đặt thành công!`);
        navigate(`/myorders?order_id=${orderId}`);
      } else {
        toast.error(response.data.message || "Lỗi khi đặt đơn hàng");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Có lỗi xảy ra khi đặt đơn hàng");
    }
  };

  return (
    <div className="place-order-container">
      <form onSubmit={placeOrder} className="place-order">
        {/* Thông tin vận chuyển */}
        <div className="place-order-left">
          <h2 className="title">Thông tin vận chuyển</h2>
          <div className="form-group multi-fields">
            <div className="input-wrapper">
              <input
                required
                name="firstName"
                onChange={onChangeHandler}
                value={data.firstName}
                type="text"
                placeholder=" "
              />
              <label>Họ</label>
            </div>
            <div className="input-wrapper">
              <input
                required
                name="lastName"
                onChange={onChangeHandler}
                value={data.lastName}
                type="text"
                placeholder=" "
              />
              <label>Tên</label>
            </div>
          </div>
          <div className="input-wrapper">
            <input
              required
              name="email"
              onChange={onChangeHandler}
              value={data.email}
              type="email"
              placeholder=" "
            />
            <label>Địa chỉ email</label>
          </div>
          <div className="input-wrapper">
            <input
              required
              name="street"
              onChange={onChangeHandler}
              value={data.street}
              type="text"
              placeholder=" "
            />
            <label>Đường/Phố</label>
          </div>
          <div className="form-group multi-fields">
            <div className="input-wrapper">
              <input
                required
                name="city"
                onChange={onChangeHandler}
                value={data.city}
                type="text"
                placeholder=" "
              />
              <label>Tỉnh/Thành phố</label>
            </div>
            <div className="input-wrapper">
              <input
                required
                name="state"
                onChange={onChangeHandler}
                value={data.state}
                type="text"
                placeholder=" "
              />
              <label>Quận/Huyện</label>
            </div>
          </div>
          <div className="input-wrapper">
            <input
              required
              name="phone"
              onChange={onChangeHandler}
              value={data.phone}
              type="tel"
              placeholder=" "
            />
            <label>Số điện thoại</label>
          </div>
        </div>

        {/* Tổng tiền và nút thanh toán */}
        <div className="place-order-right">
          <div className="cart-total">
            <h2>Tổng tiền</h2>
            <div className="cart-total-details">
              <p>Tổng tiền hàng</p>
              <p>{cartAmount.toLocaleString()} ₫</p>
            </div>
            <div className="cart-total-details">
              <p>Phí giao hàng</p>
              <p>{deliveryFee.toLocaleString()} ₫</p>
            </div>
            <hr />
            <div className="cart-total-details total">
              <b>Tổng cộng</b>
              <b>{(cartAmount + deliveryFee).toLocaleString()} ₫</b>
            </div>
            <button type="submit" className="checkout-btn">
              Hoàn tất thanh toán
            </button>
            <button
              type="button"
              className="back-btn"
              onClick={() => navigate("/cart")}
            >
              Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;