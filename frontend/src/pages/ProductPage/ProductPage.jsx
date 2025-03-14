import React, { useEffect, useState } from "react";
import ProductDisplay from "../../components/ProductDisplay/ProductDisplay";
import "./ProductPage.css";

const API_URL = import.meta.env.VITE_API_URL;

const ProductPage = () => {
    const [products, setProducts] = useState([]);
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
                const categoryParam = selectedCategory !== "All" ? `&category=${encodeURIComponent(selectedCategory)}` : "";
                const response = await fetch(`${API_URL}/api/product/list?page=${currentPage}&limit=10${categoryParam}`);
                const data = await response.json();

                if (response.ok && data.success) {
                    setProducts(data.data);
                    setTotalPages(data.totalPages);

                    if (categories.length === 0) {
                        const uniqueCategories = ["All", ...new Set(data.data.map(product => product.category))];
                        setCategories(uniqueCategories);
                    }
                } else {
                    throw new Error(data.message || "Không thể lấy danh sách sản phẩm");
                }
            } catch (error) {
                console.error("Lỗi khi fetch sản phẩm:", error);
            }
            setLoading(false);
        };

        fetchProducts();
    }, [currentPage, selectedCategory]);

    const handleCategoryChange = (e) => {
        setSelectedCategory(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="product-page">
            <h2>🛒 Danh Sách Sản Phẩm</h2>

            {/* Dropdown chọn danh mục */}
            <div className="category-filter">
                <label>Phân loại:</label>
                <select value={selectedCategory} onChange={handleCategoryChange}>
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
                    {products.length === 0 ? (
                        <p className="no-data">Không có sản phẩm nào.</p>
                    ) : (
                        <ProductDisplay products={products} />
                    )}

                    {/* Phân trang */}
                    <div className="pagination">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        >
                            ⬅ Trước
                        </button>

                        <span>Trang {currentPage} / {totalPages}</span>

                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        >
                            Sau ➡
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductPage;
