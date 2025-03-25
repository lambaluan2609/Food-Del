import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./ListOrder.css";
import * as XLSX from "xlsx";

const ListOrder = ({ url }) => {
    const [list, setList] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const limit = 10;
    const navigate = useNavigate();

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
                toast.error(response.data.message || "Lỗi khi tải danh sách đơn hàng");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error(error.response?.data?.message || "Không thể tải danh sách đơn hàng");
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
                toast.error(response.data.message || "Lỗi khi cập nhật đơn hàng");
            }
        } catch (error) {
            console.error("Update error:", error);
            toast.error(error.response?.data?.message || "Không thể cập nhật trạng thái đơn hàng");
        }
    };

    const viewOrderDetail = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    const exportToExcel = () => {
        // Dữ liệu tiêu đề
        const headerData = [
            ["Danh sách đơn hàng"],
            [`Ngày xuất: ${new Date().toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            })}`],
            [`Tổng số đơn hàng: ${totalItems}`],
            [], // Dòng trống
        ];

        // Dữ liệu bảng
        const tableData = list.map((item, index) => ({
            "STT": (page - 1) * limit + index + 1,
            "Mã đơn hàng": item._id,
            "Họ tên": `${item.firstName} ${item.lastName}`,
            "Email": item.email,
            "Số điện thoại": item.phone,
            "Tổng tiền": item.cartTotal,
            "Trạng thái": getStatusLabel(item.status),
            "Ngày đặt": item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                })
                : "N/A",
        }));

        // Tạo worksheet từ dữ liệu tiêu đề và bảng
        const ws = XLSX.utils.aoa_to_sheet(headerData);
        XLSX.utils.sheet_add_json(ws, tableData, {
            origin: "A5", // Bắt đầu từ dòng 5 để chừa chỗ cho tiêu đề
            header: ["STT", "Mã đơn hàng", "Họ tên", "Email", "Số điện thoại", "Tổng tiền", "Trạng thái", "Ngày đặt"],
        });

        // Định dạng cột
        ws["!cols"] = [
            { wch: 5 },  // STT
            { wch: 25 }, // Mã đơn hàng
            { wch: 20 }, // Họ tên
            { wch: 25 }, // Email
            { wch: 15 }, // Số điện thoại
            { wch: 15 }, // Tổng tiền
            { wch: 15 }, // Trạng thái
            { wch: 15 }, // Ngày đặt
        ];

        // Định dạng tiêu đề bảng
        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cell = ws[XLSX.utils.encode_cell({ r: 4, c: col })]; // Dòng 5 (A5, B5, ...)
            if (cell) {
                cell.s = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: "D9EAD3" } }, // Màu nền xanh nhạt
                    alignment: { horizontal: "center" },
                    border: {
                        top: { style: "thin" },
                        bottom: { style: "thin" },
                        left: { style: "thin" },
                        right: { style: "thin" },
                    },
                };
            }
        }

        // Định dạng dữ liệu
        for (let row = 5; row <= range.e.r; row++) {
            for (let col = 0; col <= 7; col++) {
                const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
                if (cell) {
                    cell.s = {
                        border: {
                            top: { style: "thin" },
                            bottom: { style: "thin" },
                            left: { style: "thin" },
                            right: { style: "thin" },
                        },
                        alignment: col === 0 || col === 5 || col === 6 ? "center" : "left", // Căn giữa STT, Tổng tiền, Trạng thái
                    };
                    // Định dạng tiền tệ cho cột "Tổng tiền"
                    if (col === 5) {
                        cell.z = "#,##0 ₫"; // Định dạng tiền tệ VND
                        cell.v = Number(cell.v); // Đảm bảo giá trị là số
                    }
                }
            }
        }

        // Định dạng tiêu đề file
        ws["A1"].s = { font: { sz: 16, bold: true }, alignment: { horizontal: "center" } };
        ws["A2"].s = { font: { sz: 12 }, alignment: { horizontal: "center" } };
        ws["A3"].s = { font: { sz: 12 }, alignment: { horizontal: "center" } };
        ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 7 } }]; // Gộp ô cho tiêu đề "Danh sách đơn hàng"

        // Tạo workbook và xuất file
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Danh sách đơn hàng");
        XLSX.writeFile(wb, `Danh_sach_don_hang_trang_${page}.xlsx`);
        toast.success("Đã xuất danh sách đơn hàng thành công!");
    };

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

    useEffect(() => {
        fetchList();
    }, [page]);

    return (
        <div className="list-order">
            <h2 className="list-title">Quản lý đơn hàng</h2>
            <p className="total-items">{`Tổng số đơn hàng: ${totalItems}`}</p>
            <div className="export-section">
                <button className="export-btn" onClick={exportToExcel}>
                    Xuất Excel
                </button>
            </div>

            {loading ? (
                <p className="loading">Đang tải đơn hàng...</p>
            ) : (
                <>
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Mã đơn hàng</th>
                                <th>Họ tên</th>
                                <th>Email</th>
                                <th>Số điện thoại</th>
                                <th>Tổng tiền</th>
                                <th>Trạng thái</th>
                                <th>Ngày đặt</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length > 0 ? (
                                list.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{(page - 1) * limit + index + 1}</td>
                                        <td>{item._id}</td>
                                        <td>{`${item.firstName} ${item.lastName}`}</td>
                                        <td>{item.email}</td>
                                        <td>{item.phone}</td>
                                        <td>{item.cartTotal.toLocaleString()} VND</td>
                                        <td>
                                            <select
                                                value={item.status}
                                                onChange={(e) => updateOrderStatus(item._id, e.target.value)}
                                                style={{ color: getStatusColor(item.status) }}
                                            >
                                                <option value="IN_PROGRESS">Đang xử lý</option>
                                                <option value="SHIPPED">Đang giao hàng</option>
                                                <option value="DELIVERED">Đã nhận</option>
                                                <option value="CANCELLED">Đã hủy</option>
                                            </select>
                                        </td>
                                        <td>
                                            {item.createdAt
                                                ? new Date(item.createdAt).toLocaleDateString("vi-VN", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                    year: "numeric",
                                                })
                                                : "N/A"}
                                        </td>
                                        <td>
                                            <button className="detail-btn" onClick={() => viewOrderDetail(item._id)}>
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="9" className="no-data">
                                        Không tìm thấy đơn hàng nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            disabled={page <= 1 || loading}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Trang trước
                        </button>
                        <span className="pagination-info">
                            Trang {page} / {totalPages}
                        </span>
                        <button
                            className="pagination-btn"
                            disabled={page >= totalPages || loading}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ListOrder;