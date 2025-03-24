import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import EditPopup from "../EditPopup/EditPopup";
import "./ListProduct.css";

const ListProduct = ({ url }) => {
    const [list, setList] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [editItem, setEditItem] = useState(null);
    const limit = 10;

    const fetchList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/product/list?page=${page}&limit=${limit}`);
            if (response.data.success) {
                setList(response.data.data);
                setTotalPages(response.data.totalPages);
                setTotalItems(response.data.totalItems);
            } else {
                toast.error("Lỗi khi tải danh sách sản phẩm");
            }
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách sản phẩm");
        }
        setLoading(false);
    }, [url, page]);

    const removeProduct = async (productId) => {
        if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này không?")) return;
        try {
            const response = await axios.delete(`${url}/api/product/remove/${productId}`);
            if (response.data.success) {
                toast.success(response.data.message);
                fetchList();
            } else {
                toast.error("Lỗi khi xóa sản phẩm");
            }
        } catch (error) {
            console.error(error);
            toast.error("Không thể xóa sản phẩm");
        }
    };

    const handleUpdate = (updatedItem) => {
        setList((prevList) => prevList.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
        setEditItem(null);
    };

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    return (
        <div className="list-product">
            <h2 className="list-title">Tất cả sản phẩm</h2>
            <p className="total-items">{`Tổng số sản phẩm: ${totalItems}`}</p>

            {loading ? (
                <p className="loading">Đang tải sản phẩm...</p>
            ) : (
                <>
                    <table className="product-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Phân loại</th>
                                <th>Giá</th>
                                <th>Tồn kho</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.length > 0 ? (
                                list.map((item, index) => (
                                    <tr key={item._id}>
                                        <td>{(page - 1) * limit + index + 1}</td>
                                        <td>
                                            <img src={item.image} alt={item.name} className="product-image" />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.price.toLocaleString()} VND</td>
                                        <td>{item.stock}</td>
                                        <td>
                                            <button onClick={() => setEditItem(item)} className="edit-btn">
                                                Edit
                                            </button>
                                            <button onClick={() => removeProduct(item._id)} className="remove-btn">
                                                X
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" className="no-data">
                                        Không tìm thấy sản phẩm nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button
                            className="pagination-btn"
                            disabled={page <= 1}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            Trang trước
                        </button>
                        <span className="pagination-info">
                            Trang {page} / {totalPages}
                        </span>
                        <button
                            className="pagination-btn"
                            disabled={page >= totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            Trang sau
                        </button>
                    </div>
                </>
            )}

            {editItem && (
                <EditPopup
                    url={url}
                    type="product"
                    item={editItem}
                    onClose={() => setEditItem(null)}
                    onUpdate={handleUpdate}
                />
            )}
        </div>
    );
};

export default ListProduct;