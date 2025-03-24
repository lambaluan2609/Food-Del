import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./MyOrders.css";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import assets from "../../assets/assets";
import logo from "../../assets/logo.png";

const MyOrders = () => {
  const { url, token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order_id");
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${url}/api/order/${orderId}`, {
        headers: { token },
      });
      console.log(response.data);
      setData(response.data.data.reverse());
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  useEffect(() => {
    if (orderId) {
      fetchOrders();
    }
  }, [orderId]);

  const getStatusLabel = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "Đang xử lý";
      case "SHIPPED":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã nhận";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "IN_PROGRESS":
        return "#ff9800";
      case "SHIPPED":
        return "#2196f3";
      case "DELIVERED":
        return "#4caf50";
      case "CANCELLED":
        return "#f44336";
      default:
        return "#000000";
    }
  };

  const showOrderDetails = (order) => {
    setSelectedOrder(order);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedOrder(null);
  };

  const copyOrderId = (orderId) => {
    navigator.clipboard.writeText(orderId);
    alert("Mã đơn hàng đã được sao chép: " + orderId);
  };

  const printOrder = (order) => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Hóa đơn ${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; margin: 0; font-size: 14px; }
            .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #ccc; padding: 20px; }
            .invoice-header { text-align: center; margin-bottom: 20px; }
            .invoice-logo { margin-bottom: 10px; }
            .invoice-logo img { max-width: 100px; height: auto; }
            .invoice-header h1 { margin: 0; font-size: 24px; }
            .invoice-header p { margin: 5px 0; color: #555; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .customer-info, .order-info { width: 45%; }
            .customer-info h3, .order-info h3 { margin-bottom: 10px; font-size: 16px; }
            .customer-info p, .order-info p { margin: 5px 0; }
            .status-highlight { font-weight: bold; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ccc; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; font-weight: bold; }
            .total-section { text-align: right; }
            .total-section p { margin: 5px 0; font-weight: bold; }
            .signature-section { display: flex; justify-content: space-between; margin-top: 40px; }
            .signature-box { width: 45%; text-align: center; }
            .signature-box p { margin: 5px 0; }
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
              <p>Ngày in: ${new Date().toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })}</p>
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
                <p><b>Ngày đặt hàng:</b> ${order.createdAt
        ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        : "N/A"
      }</p>
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
                ${order.items
        .map((item, index) => {
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
        })
        .join("")}
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
                ${order.status === "DELIVERED"
        ? `
                      <p class="signature-check">✔</p>
                      <p>(${order.customer.firstName} ${order.customer.lastName})</p>
                      <div class="signature-line"></div>
                    `
        : `<p>(Chưa ký - Đơn hàng chưa được giao)</p>`
      }
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
    <div className="my-orders">
      <h2>Giỏ hàng của tôi</h2>
      <div className="container">
        {data.length > 0 ? (
          data.map((order, index) => (
            <div key={index} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />
              <p>
                {order.items.map((item) => {
                  const product = order.products.find((prod) => prod._id === item._id);
                  return (
                    <div key={item._id}>
                      <span>{product.name + " x " + item.quantity}</span>
                    </div>
                  );
                })}
              </p>
              <p>${order.cartTotal}.00</p>
              <p>Items: {order.items.length}</p>
              <p>
                <span>●</span> <b style={{ color: getStatusColor(order.status) }}>{getStatusLabel(order.status)}</b>
              </p>
              <div className="order-actions">
                <button onClick={() => showOrderDetails(order)}>Xem chi tiết</button>
                <button onClick={() => copyOrderId(order._id)}>Sao chép mã</button>
                <button onClick={() => printOrder(order)}>In mã</button>
              </div>
            </div>
          ))
        ) : (
          <p>Không tìm thấy đơn hàng nào với mã {orderId}</p>
        )}
      </div>

      {showPopup && selectedOrder && (
        <div className="order-popup">
          <div className="order-popup-content">
            <h3 className="popup-title">Chi tiết đơn hàng</h3>
            <div className="order-details">
              <div className="customer-info">
                <h4>Thông tin khách hàng</h4>
                <p><b>Họ tên:</b> {selectedOrder.customer.firstName} {selectedOrder.customer.lastName}</p>
                <p><b>Email:</b> {selectedOrder.customer.email}</p>
                <p><b>Số điện thoại:</b> {selectedOrder.customer.phone}</p>
                <p><b>Địa chỉ:</b> {selectedOrder.customer.address}</p>
              </div>
              <div className="order-info">
                <h4>Thông tin đơn hàng</h4>
                <p><b>Mã đơn hàng:</b> {selectedOrder._id}</p>
                <p><b>Ngày đặt hàng:</b> {selectedOrder.createdAt
                  ? new Date(selectedOrder.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })
                  : "N/A"}
                </p>
                <p><b>Trạng thái:</b> <span className="status-highlight" style={{ color: getStatusColor(selectedOrder.status) }}>{getStatusLabel(selectedOrder.status)}</span></p>
              </div>
            </div>
            <h4>Danh sách sản phẩm</h4>
            <table className="order-items-table">
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
                {selectedOrder.items.map((item, index) => {
                  const product = selectedOrder.products.find((prod) => prod._id === item._id);
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{product.name}</td>
                      <td>{product.price.toLocaleString()}</td>
                      <td>{item.quantity}</td>
                      <td>{(product.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="total-section">
              <p><b>Tổng tiền giỏ hàng:</b> {selectedOrder.cartAmount.toLocaleString()} ₫</p>
              <p><b>Phí giao hàng:</b> {selectedOrder.deliveryFee.toLocaleString()} ₫</p>
              <p><b>Tổng cộng:</b> {selectedOrder.cartTotal.toLocaleString()} ₫</p>
            </div>
            <div className="popup-actions">
              <button className="copy-btn" onClick={() => copyOrderId(selectedOrder._id)}>
                Sao chép mã
              </button>
              <button className="print-btn" onClick={() => printOrder(selectedOrder)}>
                In đơn hàng
              </button>
              <button className="close-popup" onClick={closePopup}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrders;