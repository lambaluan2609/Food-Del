import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProductDetail.css';

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await fetch(`${API_URL}/api/product/detail/${id}`);
                const data = await response.json();
                if (response.ok && data.success) {
                    setProduct(data.data);
                } else {
                    throw new Error(data.message || "Không thể tải sản phẩm");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [id]);

    if (loading) return <p>Đang tải chi tiết sản phẩm...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div className="product-detail">
            <div className="product-main">
                {/* Hình ảnh sản phẩm */}
                <div className="product-image">
                    <img src={product.image} alt={product.name} />
                    <div className="thumbnail">
                        <img src={product.image} alt="Thumbnail" />
                    </div>
                </div>

                {/* Thông tin sản phẩm */}
                <div className="product-info">
                    <h1>{product.name}</h1>
                    <p className="sku">SKU: {product._id}</p>
                    {/* <p className="original-price">Giá niêm yết: <del>{(product.price * 1.2).toFixed(2)} ₫</del></p> */}
                    {/* Hiển thị giá niêm yết và giá khuyến mãi */}
                    {product.originalPrice && product.originalPrice > product.price ? (
                        <>
                            <p className="original-price">
                                Giá niêm yết: <del>{product.originalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</del>
                            </p>
                            <p className="sale-price">
                                Giá khuyến mãi: <span>{product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                            </p>
                        </>
                    ) : (
                        <p className="sale-price">
                            Giá: <span>{product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</span>
                        </p>
                    )}

                    <div className="quantity-selector">
                        <label>Số lượng:</label>
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                        <span>{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)}>+</button>
                    </div>

                    <button className="add-to-cart">🛒 THÊM VÀO GIỎ</button>
                </div>
            </div>

            {/* Mô tả & Thông tin chi tiết */}
            <div className="product-details">
                <div className="description">
                    <h2>Mô tả</h2>
                    <p>{Array.isArray(product.description) ? product.description.join(" ") : product.description}</p>
                </div>
                <div className="info-table">
                    <h2>Thông tin</h2>
                    <table>
                        <tbody>
                            <tr>
                                <td>Xuất xứ</td>
                                <td>{product.origin || "Đang cập nhật"}</td>
                            </tr>
                            <tr>
                                <td>Thành phần</td>
                                <td>{product.ingredients || "Ghi trên bao bì sản phẩm"}</td>
                            </tr>
                            <tr>
                                <td>Hướng dẫn sử dụng</td>
                                <td>{product.usageInstructions || "Đọc hướng dẫn trên bao bì"}</td>
                            </tr>
                            <tr>
                                <td>Bảo quản</td>
                                <td>{product.storageInstructions || "Tránh nhiệt độ cao và ánh nắng trực tiếp"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sản phẩm liên quan */}
            <div className="related-products">
                <h2>Sản phẩm liên quan</h2>
                <div className="product-list">
                    {/* Danh sách sản phẩm liên quan sẽ render ở đây */}
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;
