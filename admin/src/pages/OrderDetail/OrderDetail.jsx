import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import "./OrderDetail.css";

const OrderDetail = ({ url }) => {
    const { id } = useParams();
    const navigate = useNavigate(); // Khởi tạo useNavigate
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchOrderDetail = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/order/${id}`);
            if (response.data.success) {
                setOrder(response.data.data[0]); // API trả về mảng, lấy phần tử đầu tiên
            } else {
                toast.error(response.data.message || "Không tìm thấy đơn hàng");
            }
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            toast.error("Không thể tải chi tiết đơn hàng");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

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

    const handleBack = () => {
        navigate("/list-order"); // Quay lại trang ListOrder
    };

    if (loading) return <p>Đang tải...</p>;
    if (!order) return <p>Không tìm thấy đơn hàng</p>;

    return (
        <div className="order-detail">
            <h2 className="order-title">Chi tiết đơn hàng</h2>
            <div className="order-details">
                <div className="customer-info">
                    <h4>Thông tin khách hàng</h4>
                    <p>
                        <b>Họ tên:</b> {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p><b>Email:</b> {order.customer.email}</p>
                    <p><b>Số điện thoại:</b> {order.customer.phone}</p>
                    <p><b>Địa chỉ:</b> {order.customer.address}</p> {/* Hiển thị địa chỉ từ customer.address */}
                </div>
                <div className="order-info">
                    <h4>Thông tin đơn hàng</h4>
                    <p><b>Mã đơn hàng:</b> {order._id}</p>
                    <p>
                        <b>Ngày đặt hàng:</b>{" "}
                        {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })
                            : "N/A"}
                    </p>
                    <p>
                        <b>Trạng thái:</b>{" "}
                        <span className="status-highlight" style={{ color: getStatusColor(order.status) }}>
                            {getStatusLabel(order.status)}
                        </span>
                    </p>
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
                    {order.items.map((item, index) => {
                        const product = order.products.find((prod) => prod._id === item._id);
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
                <p><b>Tổng tiền giỏ hàng:</b> {order.cartAmount.toLocaleString()} ₫</p>
                <p><b>Phí giao hàng:</b> {order.deliveryFee.toLocaleString()} ₫</p>
                <p><b>Tổng cộng:</b> {order.cartTotal.toLocaleString()} ₫</p>
            </div>
            <div className="actions">
                <button className="back-btn" onClick={handleBack}>
                    Quay lại
                </button>
            </div>
        </div>
    );
};

export default OrderDetail;