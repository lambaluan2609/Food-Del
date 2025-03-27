import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./ListOrder.css";
import * as XLSX from "xlsx";

const ListOrder = ({ url }) => {
    const [allOrders, setAllOrders] = useState([]);
    const [displayedOrders, setDisplayedOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [page, setPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchType, setSearchType] = useState("orderId");
    const [statusFilter, setStatusFilter] = useState(""); // Thêm state cho filter trạng thái
    const [loading, setLoading] = useState(false);
    const limit = 10;
    const navigate = useNavigate();

    const fetchList = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/order/`);
            if (response.data.success) {
                const sortedOrders = (response.data.data || []).sort((a, b) =>
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
                setAllOrders(sortedOrders);
                applyFilters(sortedOrders, searchQuery, statusFilter); // Áp dụng filter ngay sau khi lấy dữ liệu
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

    // Hàm áp dụng filter cho tìm kiếm và trạng thái
    const applyFilters = (orders, query, status) => {
        let filtered = [...orders];

        // Lọc theo tìm kiếm
        if (query.trim() !== "") {
            filtered = filtered.filter((order) => {
                const searchValue = query.toLowerCase();
                switch (searchType) {
                    case "orderId":
                        return order._id.toLowerCase().includes(searchValue);
                    case "email":
                        return order.email.toLowerCase().includes(searchValue);
                    case "phone":
                        return order.phone.toLowerCase().includes(searchValue);
                    default:
                        return false;
                }
            });
        }

        // Lọc theo trạng thái
        if (status !== "") {
            filtered = filtered.filter((order) => order.status === status);
        }

        setFilteredOrders(filtered);
        setTotalItems(filtered.length);
        setPage(1); // Reset về trang 1 khi filter thay đổi
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        applyFilters(allOrders, query, statusFilter);
    };

    const handleStatusFilter = (status) => {
        setStatusFilter(status);
        applyFilters(allOrders, searchQuery, status);
    };

    const updateDisplayedOrders = () => {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        setDisplayedOrders(filteredOrders.slice(startIndex, endIndex));
    };

    const updateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await axios.put(`${url}/api/order/${orderId}`, { status: newStatus });
            if (response.data.success) {
                toast.success(response.data.message);
                setAllOrders((prevOrders) =>
                    prevOrdersSister.map((item) => (item._id === orderId ? { ...item, status: newStatus } : item))
                );
                applyFilters(
                    allOrders.map((item) => (item._id === orderId ? { ...item, status: newStatus } : item)),
                    searchQuery,
                    statusFilter
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
        // Tính tổng doanh thu chỉ cho trạng thái "DELIVERED"
        let deliveredOrders = filteredOrders;
        if (statusFilter === "" || statusFilter === "DELIVERED") {
            deliveredOrders = filteredOrders.filter((order) => order.status === "DELIVERED");
        } else {
            deliveredOrders = []; // Nếu filter không phải "DELIVERED" thì không tính doanh thu
        }
        const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.cartTotal, 0);

        const headerData = [
            ["Danh sách đơn hàng"],
            [`Ngày xuất: ${new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}`],
            [`Tổng số đơn hàng: ${totalItems}`],
            [],
        ];

        const tableData = filteredOrders.map((item, index) => ({
            "STT": index + 1,
            "Mã đơn hàng": item._id,
            "Họ tên": `${item.firstName} ${item.lastName}`,
            "Email": item.email,
            "Số điện thoại": item.phone,
            "Tổng tiền": item.cartTotal,
            "Trạng thái": getStatusLabel(item.status),
            "Ngày đặt": item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })
                : "N/A",
        }));

        const ws = XLSX.utils.aoa_to_sheet(headerData);
        XLSX.utils.sheet_add_json(ws, tableData, {
            origin: "A5",
            header: ["STT", "Mã đơn hàng", "Họ tên", "Email", "Số điện thoại", "Tổng tiền", "Trạng thái", "Ngày đặt"],
        });

        const lastRow = 5 + tableData.length;
        XLSX.utils.sheet_add_aoa(ws, [[`Tổng doanh thu (Đã nhận): ${totalRevenue.toLocaleString()} ₫`]], {
            origin: `A${lastRow + 1}`,
        });

        ws["!autofilter"] = { ref: "A5:H5" };
        ws["!cols"] = [
            { wch: 5 }, { wch: 25 }, { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        ];

        const range = XLSX.utils.decode_range(ws["!ref"]);
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cell = ws[XLSX.utils.encode_cell({ r: 4, c: col })];
            if (cell) {
                cell.s = {
                    font: { bold: true },
                    fill: { fgColor: { rgb: "D9EAD3" } },
                    alignment: { horizontal: "center" },
                    border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
                };
            }
        }

        for (let row = 5; row <= lastRow; row++) {
            for (let col = 0; col <= 7; col++) {
                const cell = ws[XLSX.utils.encode_cell({ r: row, c: col })];
                if (cell) {
                    cell.s = {
                        border: { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } },
                        alignment: col === 0 || col === 5 || col === 6 ? "center" : "left",
                    };
                    if (col === 5) {
                        cell.z = "#,##0 ₫";
                        cell.v = Number(cell.v);
                    }
                }
            }
        }

        const totalRevenueCell = ws[`A${lastRow + 1}`];
        if (totalRevenueCell) {
            totalRevenueCell.s = {
                font: { bold: true, color: { rgb: "FF0000" } },
                alignment: { horizontal: "left" },
            };
        }

        ws["A1"].s = { font: { sz: 16, bold: true }, alignment: { horizontal: "center" } };
        ws["A2"].s = { font: { sz: 12 }, alignment: { horizontal: "center" } };
        ws["A3"].s = { font: { sz: 12 }, alignment: { horizontal: "center" } };
        ws["!merges"] = [
            { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
            { s: { r: lastRow, c: 0 }, e: { r: lastRow, c: 7 } },
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Danh sách đơn hàng");
        XLSX.writeFile(wb, `Danh_sach_don_hang_${new Date().toISOString().slice(0, 10)}.xlsx`);
        toast.success("Đã xuất danh sách đơn hàng thành công!");
    };

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

    useEffect(() => {
        fetchList();
    }, []);

    useEffect(() => {
        updateDisplayedOrders();
    }, [page, filteredOrders]);

    return (
        <div className="list-order">
            <h2 className="list-title">Quản lý đơn hàng</h2>
            <p className="total-items">{`Tổng số đơn hàng: ${totalItems}`}</p>
            <div className="search-export-section">
                <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="search-type-select"
                >
                    <option value="orderId">Mã đơn hàng</option>
                    <option value="email">Email</option>
                    <option value="phone">Số điện thoại</option>
                </select>
                <input
                    type="text"
                    placeholder={`Tìm theo ${searchType === "orderId" ? "mã đơn hàng" : searchType === "email" ? "email" : "số điện thoại"}...`}
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="search-input"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    className="status-filter-select"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="IN_PROGRESS">Đang xử lý</option>
                    <option value="SHIPPED">Đang giao hàng</option>
                    <option value="DELIVERED">Đã nhận</option>
                    <option value="CANCELLED">Đã hủy</option>
                </select>
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
                            {displayedOrders.length > 0 ? (
                                displayedOrders.map((item, index) => (
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
                            Trang {page} / {Math.ceil(totalItems / limit)}
                        </span>
                        <button
                            className="pagination-btn"
                            disabled={page >= Math.ceil(totalItems / limit) || loading}
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