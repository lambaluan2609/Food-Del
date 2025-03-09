import React, { useEffect, useState, useCallback } from "react";
import "./ListProduct.css";
import axios from "axios";
import { toast } from "react-toastify";

const ListProduct = ({ url }) => {
    const [list, setList] = useState([]);
    const [totalItems, setTotalItems] = useState(0); // ✅ Thêm tổng số sản phẩm
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const limit = 10; // Số sản phẩm mỗi trang

    const fetchList = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${url}/api/product/list?page=${page}&limit=${limit}`);
            if (response.data.success) {
                setList(response.data.data);
                setTotalPages(response.data.totalPages);
                setTotalItems(response.data.totalItems); // ✅ Cập nhật tổng số sản phẩm
            } else {
                toast.error("Error fetching product list");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load product list");
        }
        setLoading(false);
    }, [url, page]);

    const removeProduct = async (productId) => {
        if (!window.confirm("Are you sure you want to remove this product?")) return;

        try {
            const response = await axios.delete(`${url}/api/product/remove/${productId}`);
            if (response.data.success) {
                toast.success(response.data.message);
                fetchList();
            } else {
                toast.error("Error removing product");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove product");
        }
    };

    useEffect(() => {
        fetchList();
    }, [fetchList]);

    return (
        <div className="list add flex-col">
            <p>Tất cả sản phẩm</p>

            {/* ✅ Hiển thị tổng số sản phẩm */}
            {/* <p>{`Total Products: ${totalItems}`}</p> */}

            {/* ✅ Hiển thị trạng thái loading */}
            {loading && <p>Loading products...</p>}

            <div className="list-table">
                <div className="list-table-format title">
                    <b>STT</b> {/* ✅ Thêm cột Số Thứ Tự */}
                    <b>Hình ảnh</b>
                    <b>Tên sản phẩm</b>
                    <b>Phân loại</b>
                    <b>Giá</b>
                    <b>Tồn kho</b>
                    <b>Action</b>
                </div>

                {list.length > 0 ? (
                    list.map((item, index) => (
                        <div key={item._id} className="list-table-format">
                            <p>{(page - 1) * limit + index + 1}</p> {/* ✅ Tính STT chính xác */}
                            <img src={item.image} alt={item.name} />
                            <p>{item.name}</p>
                            <p>{item.category}</p>
                            <p>{item.price.toLocaleString()} VND</p>
                            <p>{item.stock}</p>
                            <p onClick={() => removeProduct(item._id)} className="cursor">
                                X
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No products found</p>
                )}
            </div>
            {/* ✅ Hiển thị tổng số sản phẩm */}
            <p>{`Total Products: ${totalItems}`}</p>

            {/* ✅ Nút phân trang */}
            <div className="pagination">
                <button disabled={page <= 1} onClick={() => setPage((prev) => prev - 1)}>
                    Prev
                </button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page >= totalPages} onClick={() => setPage((prev) => prev + 1)}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default ListProduct;
