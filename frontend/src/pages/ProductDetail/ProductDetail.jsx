import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import "./ProductDetail.css";

const API_URL = import.meta.env.VITE_API_URL;

const ProductDetail = () => {
    const { id } = useParams();
    const { addToCart } = useContext(StoreContext);
    const navigate = useNavigate(); // Để điều hướng khi mua ngay
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

    const handleAddToCart = () => {
        if (product) {
            if (quantity > (product.stock || Infinity)) {
                toast.error(`Số lượng yêu cầu (${quantity}) vượt quá tồn kho (${product.stock})`);
                return;
            }
            for (let i = 0; i < quantity; i++) {
                addToCart(product._id);
            }
            toast.success(`${quantity} ${product.name} đã được thêm vào giỏ hàng!`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const handleBuyNow = () => {
        if (product) {
            if (quantity > (product.stock || Infinity)) {
                toast.error(`Số lượng yêu cầu (${quantity}) vượt quá tồn kho (${product.stock})`);
                return;
            }
            for (let i = 0; i < quantity; i++) {
                addToCart(product._id);
            }
            navigate("/cart"); // Chuyển hướng tới giỏ hàng để thanh toán ngay
        }
    };

    if (loading) return <div className="loading">Đang tải chi tiết sản phẩm...</div>;
    if (error) return <div className="error">Lỗi: {error}</div>;

    return (
        <div className="product-detail-container">
            <div className="product-detail">
                <div className="product-main">
                    {/* Hình ảnh sản phẩm */}
                    <div className="product-image-section">
                        <div className="main-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="thumbnails">
                            <img src={product.image} alt="Thumbnail 1" className="thumbnail-img" />
                            {/* Thêm nhiều ảnh nếu API hỗ trợ */}
                        </div>
                    </div>

                    {/* Thông tin sản phẩm */}
                    <div className="product-info-section">
                        <h1 className="product-title">{product.name}</h1>
                        <div className="product-rating">
                            <span>⭐ 4.5 (100 đánh giá)</span> {/* Giả lập, thay bằng dữ liệu thực nếu có */}
                        </div>

                        <div className="price-section">
                            {product.originalPrice && product.originalPrice > product.price ? (
                                <>
                                    <span className="original-price">
                                        <del>{product.originalPrice.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}</del>
                                    </span>
                                    <span className="sale-price">
                                        {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                    </span>
                                    <span className="discount">
                                        Giảm {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                                    </span>
                                </>
                            ) : (
                                <span className="sale-price">
                                    {product.price.toLocaleString("vi-VN", { style: "currency", currency: "VND" })}
                                </span>
                            )}
                        </div>

                        <div className="stock-info">Tồn kho: {product.stock || "Đang cập nhật"}</div>

                        <div className="quantity-section">
                            <label>Số lượng:</label>
                            <div className="quantity-selector">
                                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                                <span>{quantity}</span>
                                <button onClick={() => setQuantity(quantity + 1)}>+</button>
                            </div>
                        </div>

                        <div className="action-buttons">
                            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                <span role="img" aria-label="cart">🛒</span> Thêm vào giỏ
                            </button>
                            <button className="buy-now-btn" onClick={handleBuyNow}>
                                Mua ngay
                            </button>
                        </div>

                        <div className="shipping-info">
                            <p><strong>Giao hàng:</strong> Miễn phí cho đơn từ 200.000₫</p>
                            <p><strong>Thời gian giao:</strong> 2-7 tiếng sau khi đặt hàng</p>
                        </div>
                    </div>
                </div>

                {/* Mô tả & Thông tin chi tiết */}
                <div className="product-details-section">
                    <div className="description">
                        <h2>Mô tả sản phẩm</h2>
                        <p>{Array.isArray(product.description) ? product.description.join(" ") : product.description}</p>
                    </div>
                    <div className="info-table">
                        <h2>Thông tin chi tiết</h2>
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
                <div className="related-products-section">
                    <h2>Sản phẩm liên quan</h2>
                    <div className="related-products">
                        {/* Thêm logic để render danh sách sản phẩm liên quan */}
                        {/* <p>Chưa có sản phẩm liên quan (Cần API để hiển thị).</p> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;