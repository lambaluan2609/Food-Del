import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ListOrder.css";

const ListOrder = ({ url }) => {
    const [list, setList] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const limit = 10;

    const fetchList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/order/`, {
                params: { page, limit },
            });
            if (response.data.success) {
                setList(response.data.data || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalItems(response.data.totalItems || 0);
            } else {
                toast.error(response.data.message || "Error fetching order list");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error(error.response?.data?.message || "Failed to load order list");
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.put(`${url}/api/order/${orderId}`, { status: newStatus });
            if (response.data.success) {
                toast.success(response.data.message);
                setList((prevList) =>
                    prevList.map((item) => (item._id === orderId ? { ...item, status: newStatus } : item))
                );
            } else {
                toast.error(response.data.message || "Error updating order");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Failed to update order status");
        }
    };

    useEffect(() => {
        fetchList();
    }, [page]);

    return (
        <div className="list-order add flex-col">
            <p>Quản lý đơn hàng</p>
            <p>{`Tổng số đơn hàng: ${totalItems}`}</p>

            {loading ? (
                <p>Loading orders...</p>
            ) : (
                <>
                    <div className="list-table">
                        <div className="list-table-format title">
                            <b>STT</b>
                            <b>Mã đơn hàng</b> {/* Thêm cột mới */}
                            <b>Họ tên</b>
                            <b>Email</b>
                            <b>Số điện thoại</b>
                            <b>Tổng tiền</b>
                            <b>Trạng thái</b>
                            <b>Ngày đặt</b>
                            <b>Action</b>
                        </div>
                        {list.length > 0 ? (
                            list.map((item, index) => (
                                <div key={item._id} className="list-table-format">
                                    <p>{(page - 1) * limit + index + 1}</p>
                                    <p>{item._id}</p> {/* Hiển thị _id làm mã đơn hàng */}
                                    <p>{`${item.firstName} ${item.lastName}`}</p>
                                    <p>{item.email}</p>
                                    <p>{item.phone}</p>
                                    <p>{item.cartTotal.toLocaleString()} VND</p>
                                    <select
                                        value={item.status}
                                        onChange={(e) => updateOrderStatus(item._id, e.target.value)}
                                    >
                                        <option value="IN_PROGRESS">Đang xử lý</option>
                                        <option value="SHIPPED">Đang giao hàng</option>
                                        <option value="DELIVERED">Đã nhận</option>
                                        <option value="CANCELLED">Đã hủy</option>
                                    </select>
                                    <p>
                                        {item.createdAt
                                            ? new Date(item.createdAt).toLocaleDateString("vi-VN", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })
                                            : "N/A"}
                                    </p>
                                    <p>
                                        <a href={`/order/${item._id}`} target="_blank">Chi tiết</a>
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p>No orders found</p>
                        )}
                    </div>
                    <div className="pagination">
                        <button disabled={page <= 1 || loading} onClick={() => setPage((prev) => prev - 1)}>
                            Prev
                        </button>
                        <span>Page {page} of {totalPages}</span>
                        <button disabled={page >= totalPages || loading} onClick={() => setPage((prev) => prev + 1)}>
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ListOrder;