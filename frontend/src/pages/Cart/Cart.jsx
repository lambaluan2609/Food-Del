import React, { useContext, useState } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/logo.png";

const Cart = () => {
  const { cartItems, productList, removeFromCart, setCartItems, cartAmount, deliveryFee, url } = useContext(StoreContext);
  const navigate = useNavigate();

  const [orderCode, setOrderCode] = useState("");
  const [error, setError] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const isCartEmpty = Object.keys(cartItems).every((key) => cartItems[key] === 0);

  const getStatusLabel = (status) => {
    switch (status) {
      case "IN_PROGRESS": return "Đang xử lý";
      case "SHIPPED": return "Đang giao hàng";
      case "DELIVERED": return "Đã nhận";
      case "CANCELLED": return "Đã hủy";
      default: return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "IN_PROGRESS": return "#ff9800";
      case "SHIPPED": return "#2196f3";
      case "DELIVERED": return "#4caf50";
      case "CANCELLED": return "#f44336";
      default: return "#000000";
    }
  };

  const handleCheckOrder = async () => {
    if (!orderCode) {
      setError("Vui lòng nhập mã đơn hàng");
      setOrderDetails(null);
      return;
    }

    try {
      const response = await fetch(`${url}/api/order/${orderCode}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (data.success) {
        setOrderDetails(data.data[0]);
        setError("");
        setOrderCode("");
        setShowPopup(true);
      } else {
        setError(data.message || "Đơn hàng không tồn tại");
        setOrderDetails(null);
      }
    } catch (err) {
      console.error("Error fetching order:", err);
      setError("Có lỗi xảy ra khi kiểm tra đơn hàng");
      setOrderDetails(null);
    }
  };

  const handleClearCart = () => {
    setCartItems({});
    toast.success("Đã xóa toàn bộ giỏ hàng!");
  };

  const closePopup = () => {
    setShowPopup(false);
    setOrderDetails(null);
  };

  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    toast.success(`Mã đơn hàng đã được sao chép: ${orderId}`);
  };

  const printOrder = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn ${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; margin: 0; font-size: 14px; }
            .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
            .invoice-header { text-align: center; margin-bottom: 20px; }
            .invoice-logo img { max-width: 100px; height: auto; }
            .invoice-header h1 { margin: 10px 0; font-size: 24px; color: #333; }
            .invoice-header p { margin: 5px 0; color: #666; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .customer-info, .order-info { width: 48%; background: #fafafa; padding: 10px; border-radius: 5px; }
            .customer-info h3, .order-info h3 { margin-bottom: 10px; font-size: 16px; color: #333; }
            .customer-info p, .order-info p { margin: 5px 0; color: #555; }
            .status-highlight { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .total-section { text-align: right; }
            .total-section p { margin: 5px 0; font-weight: bold; color: #333; }
            .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
            .signature-box { width: 48%; text-align: center; }
            .signature-box p { margin: 5px 0; color: #666; }
            .signature-line { border-top: 1px solid #000; margin-top: 20px; }
            .signature-check { font-size: 20px; color: #4caf50; margin: 5px 0; }
            @media print { .no-print { display: none; } }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="invoice-header">
              <div class="invoice-logo">
                <img src="${logo}" alt="Logo" />
              </div>
              <h1>HÓA ĐƠN MUA HÀNG</h1>
              <p>Cook&Carry - Địa chỉ: Đại học FPT Quy Nhơn - Tp. Quy Nhơn, Bình Định</p>
              <p>Ngày in: ${new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
            </div>
            <div class="invoice-details">
              <div class="customer-info">
                <h3>Thông tin khách hàng</h3>
                <p><b>Họ tên:</b> ${order.customer.firstName} ${order.customer.lastName}</p>
                <p><b>Email:</b> ${order.customer.email}</p>
                <p><b>Số điện thoại:</b> ${order.customer.phone}</p>
                <p><b>Địa chỉ:</b> ${order.customer.address}</p>
              </div>
              <div class="order-info">
                <h3>Thông tin đơn hàng</h3>
                <p><b>Mã đơn hàng:</b> ${order._id}</p>
                <p><b>Ngày đặt hàng:</b> ${order.createdAt ? new Date(order.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" }) : "N/A"}</p>
                <p><b>Trạng thái:</b> <span class="status-highlight" style="color: ${getStatusColor(order.status)}">${getStatusLabel(order.status)}</span></p>
              </div>
            </div>
            <h3>Danh sách sản phẩm</h3>
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sản phẩm</th>
                  <th>Giá (₫)</th>
                  <th>Số lượng</th>
                  <th>Thành tiền (₫)</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map((item, index) => {
      const product = order.products.find((prod) => prod._id === item._id);
      return `
                    <tr>
                      <td>${index + 1}</td>
                      <td>${product.name}</td>
                      <td>${product.price.toLocaleString()}</td>
                      <td>${item.quantity}</td>
                      <td>${(product.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  `;
    }).join("")}
              </tbody>
            </table>
            <div class="total-section">
              <p>Tổng tiền giỏ hàng: ${order.cartAmount.toLocaleString()} ₫</p>
              <p>Phí giao hàng: ${order.deliveryFee.toLocaleString()} ₫</p>
              <p><b>Tổng cộng: ${order.cartTotal.toLocaleString()} ₫</b></p>
            </div>
            <div class="signature-section">
              <div class="signature-box">
                <p>Chữ ký người bán</p>
                <p class="signature-check">✔</p>
                <p>(Đã ký điện tử bởi Cook&Carry)</p>
                <div class="signature-line"></div>
              </div>
              <div class="signature-box">
                <p>Chữ ký người nhận</p>
                ${order.status === "DELIVERED" ? `
                  <p class="signature-check">✔</p>
                  <p>(${order.customer.firstName} ${order.customer.lastName})</p>
                  <div class="signature-line"></div>
                ` : `<p>(Chưa ký - Đơn hàng chưa được giao)</p>`}
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="cart-container">
      {/* Kiểm tra đơn hàng */}
      <div className="order-check-section">
        <h2>Kiểm tra đơn hàng</h2>
        <div className="order-check-input">
          <input
            type="text"
            placeholder="Nhập mã đơn hàng"
            value={orderCode}
            onChange={(e) => setOrderCode(e.target.value)}
          />
          <button onClick={handleCheckOrder}>Kiểm tra</button>
        </div>
        <div className="feedback-section">
          Phản hồi xin liên hệ về Zalo: <a href="https://zalo.me/0868470229" target="_blank" rel="noopener noreferrer">0868470229</a> / <a href="https://zalo.me/0866942857" target="_blank" rel="noopener noreferrer">0866942857</a>
        </div>
        {error && <p className="error-message">{error}</p>}
      </div>

      {/* Giỏ hàng */}
      <div className="cart-content">
        {isCartEmpty ? (
          <div className="empty-cart">
            <p>Chưa có sản phẩm nào trong giỏ hàng</p>
            <button className="shop-now-btn" onClick={() => navigate("/product")}>
              Mua sắm ngay
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items-section">
              <div className="cart-header">
                <h2>Giỏ hàng của bạn</h2>
                <button className="clear-cart-btn" onClick={handleClearCart}>
                  Xóa tất cả
                </button>
              </div>
              <div className="cart-items">
                <div className="cart-items-title">
                  <p>Mặt hàng</p>
                  <p>Mô tả</p>
                  <p>Giá</p>
                  <p>Số lượng</p>
                  <p>Thành tiền</p>
                  <p></p>
                </div>
                <hr />
                {productList.map((item) => {
                  if (cartItems[item._id] > 0) {
                    return (
                      <div key={item._id} className="cart-item">
                        <img src={item.image} alt={item.name} />
                        <p>{item.name}</p>
                        <p>{item.price.toLocaleString()} ₫</p>
                        <p>{cartItems[item._id]}</p>
                        <p>{(item.price * cartItems[item._id]).toLocaleString()} ₫</p>
                        <button
                          className="remove-btn"
                          onClick={() => removeFromCart(item._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>

            <div className="cart-total-section">
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
              <button className="checkout-btn" onClick={() => navigate("/order")}>
                Tiến hành thanh toán
              </button>
            </div>
          </>
        )}
      </div>

      {/* Popup chi tiết đơn hàng */}
      {showPopup && orderDetails && (
        <div className="order-popup">
          <div className="order-popup-content">
            <h3>Chi tiết đơn hàng #{orderDetails._id}</h3>
            <div className="order-details">
              <div className="customer-info">
                <h4>Thông tin khách hàng</h4>
                <p><b>Họ tên:</b> {orderDetails.customer.firstName} {orderDetails.customer.lastName}</p>
                <p><b>Email:</b> {orderDetails.customer.email}</p>
                <p><b>Số điện thoại:</b> {orderDetails.customer.phone}</p>
                <p><b>Địa chỉ:</b> {orderDetails.customer.address}</p>
              </div>
              <div className="order-info">
                <h4>Thông tin đơn hàng</h4>
                <p><b>Mã đơn hàng:</b> {orderDetails._id}</p>
                <p><b>Ngày đặt:</b> {new Date(orderDetails.createdAt).toLocaleDateString("vi-VN")}</p>
                <p><b>Trạng thái:</b> <span style={{ color: getStatusColor(orderDetails.status) }}>{getStatusLabel(orderDetails.status)}</span></p>
              </div>
            </div>
            <h4>Danh sách sản phẩm</h4>
            <div className="order-items-table">
              <div className="table-header">
                <span>STT</span>
                <span>Tên sản phẩm</span>
                <span>Giá (₫)</span>
                <span>Số lượng</span>
                <span>Thành tiền (₫)</span>
              </div>
              {orderDetails.items.map((item, index) => {
                const product = orderDetails.products.find((prod) => prod._id === item._id);
                return (
                  <div key={index} className="table-row">
                    <span>{index + 1}</span>
                    <span>{product.name}</span>
                    <span>{product.price.toLocaleString()}</span>
                    <span>{item.quantity}</span>
                    <span>{(product.price * item.quantity).toLocaleString()}</span>
                  </div>
                );
              })}
            </div>
            <div className="total-section">
              <p>Tổng tiền hàng: {orderDetails.cartAmount.toLocaleString()} ₫</p>
              <p>Phí giao hàng: {orderDetails.deliveryFee.toLocaleString()} ₫</p>
              <p><b>Tổng cộng:</b> {orderDetails.cartTotal.toLocaleString()} ₫</p>
            </div>
            <div className="popup-actions">
              <button onClick={() => copyOrderId(orderDetails._id)}>Sao chép mã</button>
              <button onClick={() => printOrder(orderDetails)}>In đơn hàng</button>
              <button onClick={closePopup}>Đóng</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;