import React, { useEffect, useState } from "react";
import ProductDisplay from "../../components/ProductDisplay/ProductDisplay";
import "./ProductPage.css";

const API_URL = import.meta.env.VITE_API_URL;

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_URL}/api/product/list?page=${currentPage}&limit=10`);
                const data = await response.json();

                if (response.ok && data.success) {
                    setProducts(data.data);
                    setTotalPages(data.totalPages);

                    // Lấy danh sách danh mục từ dữ liệu sản phẩm
                    const uniqueCategories = ["All", ...new Set(data.data.map(product => product.category))];
                    setCategories(uniqueCategories);
                    setFilteredProducts(data.data);
                } else {
                    throw new Error(data.message || "Không thể lấy danh sách sản phẩm");
                }
            } catch (error) {
                console.error("Lỗi khi fetch sản phẩm:", error);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [currentPage]);

    // Cập nhật danh sách sản phẩm khi chọn danh mục
    useEffect(() => {
        if (selectedCategory === "All") {
            setFilteredProducts(products);
        } else {
            setFilteredProducts(products.filter(product => product.category === selectedCategory));
        }
    }, [selectedCategory, products]);

    return (
        <div className="product-page">
            <h2>Danh Sách Sản Phẩm</h2>

            {/* Dropdown chọn danh mục */}
            <div className="category-filter">
                <label>Phân loại:</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            {/* Hiển thị Loading */}
            {loading ? (
                <p className="loading">Đang tải sản phẩm...</p>
            ) : (
                <>
                    {/* Nếu không có sản phẩm hiển thị */}
                    {filteredProducts.length === 0 ? (
                        <p className="no-data">Không có sản phẩm nào.</p>
                    ) : (
                        <ProductDisplay products={filteredProducts} />
                    )}

                    {/* Phân trang */}
                    <div className="pagination">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                            Trước
                        </button>

                        <span>Trang {currentPage} / {totalPages}</span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                            Sau
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductPage;
