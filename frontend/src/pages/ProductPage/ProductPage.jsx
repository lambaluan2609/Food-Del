import React, { useEffect, useState } from 'react';
import ProductDisplay from '../../components/ProductDisplay/ProductDisplay';
import './ProductPage.css';

const API_URL = import.meta.env.VITE_API_URL;

const ProductPage = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("All");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`${API_URL}/api/product/list`);
                const data = await response.json();

                if (response.ok && data.success) {
                    setProducts(data.data);

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
        };

        fetchProducts();
    }, []);

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
            {/* <h2>Danh Sách Sản Phẩm</h2> */}

            {/* Dropdown chọn danh mục */}
            <div className="category-filter">
                <label>Phân loại:</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                    {categories.map((category, index) => (
                        <option key={index} value={category}>{category}</option>
                    ))}
                </select>
            </div>

            <ProductDisplay products={filteredProducts} />
        </div>
    );
};

export default ProductPage;
