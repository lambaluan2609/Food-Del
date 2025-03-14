import React, { useContext } from 'react';
import './ProductItem.css';
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import assets from '../../assets/assets';

const ProductItem = ({ id, name, price, originalPrice, description, image }) => {
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
    const navigate = useNavigate();

    // Tính % giảm giá (chỉ hiển thị nếu có giảm giá)
    const discountPercentage = originalPrice && originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0;

    return (
        <div className='product-item' onClick={() => navigate(`/product/detail/${id}`)}>
            <div className="product-item-image-container">
                {discountPercentage > 0 && (
                    <span className="discount-badge">-{discountPercentage}%</span>
                )}
                <img className='product-item-image' src={image} alt={name} />

                {/* Nút thêm vào giỏ hàng */}
                <div className="cart-actions">
                    {!cartItems[id] ? (
                        <img className='add'
                            onClick={(e) => {
                                e.stopPropagation();
                                addToCart(id);
                            }}
                            src={assets.add_icon_white}
                            alt="Thêm vào giỏ"
                        />
                    ) : (
                        <div className='product-item-counter'>
                            <img onClick={(e) => {
                                e.stopPropagation();
                                removeFromCart(id);
                            }}
                                src={assets.remove_icon_red}
                                alt="Xóa"
                            />
                            <p>{cartItems[id]}</p>
                            <img onClick={(e) => {
                                e.stopPropagation();
                                addToCart(id);
                            }}
                                src={assets.add_icon_green}
                                alt="Thêm"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="product-item-info">
                <p className="product-item-name">{name}</p>
                <p className="product-item-desc">
                    {description.length > 80 ? description.slice(0, 80) + "..." : description}
                </p>

                <div className="product-item-prices">
                    <span className="sale-price">{price} ₫</span>
                    {originalPrice && (
                        <span className="original-price">{originalPrice} ₫</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductItem;
