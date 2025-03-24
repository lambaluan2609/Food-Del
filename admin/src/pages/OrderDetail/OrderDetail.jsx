import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import "./OrderDetail.css";

const OrderDetail = ({ url }) => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchOrderDetail = async () => {
        setLoading(true);
        try {
            // Sửa URL thành /:id thay vì /api/order/detail/:id
            const response = await axios.get(`${url}/${id}`);
            if (response.data.success) {
                setOrder(response.data.data[0]); // API trả về mảng, lấy phần tử đầu tiên
            } else {
                toast.error(response.data.message || "Error fetching order detail");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("Failed to load order detail");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetail();
    }, [id]);

    if (loading) return <p>Loading...</p>;
    if (!order) return <p>No order found</p>;

    return (
        <div className="order-detail flex-col">
            <h2>Chi tiết đơn hàng</h2>
            <div className="order-info">
                <p><b>ID:</b> {order._id}</p>
                <p><b>Họ tên:</b> {order.firstName} {order.lastName}</p>
                <p><b>Email:</b> {order.email}</p>
                <p><b>Số điện thoại:</b> {order.phone}</p>
                <p><b>Địa chỉ:</b> {order.street}, {order.city}, {order.state}</p>
                <p><b>Tổng tiền giỏ hàng:</b> {order.cartAmount.toLocaleString()} VND</p>
                <p><b>Phí giao hàng:</b> {order.deliveryFee.toLocaleString()} VND</p>
                <p><b>Tổng cộng:</b> {order.cartTotal.toLocaleString()} VND</p>
                <p><b>Trạng thái:</b> {order.status}</p>
            </div>
            <h3>Sản phẩm</h3>
            <div className="order-items">
                {order.items.map((item, index) => (
                    <div key={index} className="item">
                        <p><b>Sản phẩm {index + 1}:</b> ID: {item._id}</p>
                        {order.products && order.products[index] && (
                            <>
                                <p><b>Tên:</b> {order.products[index].name}</p>
                                <p><b>Giá:</b> {order.products[index].price.toLocaleString()} VND</p>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderDetail;