import React from 'react';
import './ProductDisplay.css';
import ProductItem from '../ProductItem/ProductItem';

const ProductDisplay = ({ products }) => {
    return (
        <div className='product-display' id='product-display'>
            <h2>Tất cả sản phẩm</h2>
            <div className="product-display-list">
                {products.length > 0 ? (
                    products.map((item, index) => (
                        <ProductItem
                            key={index}
                            id={item._id}
                            name={item.name}
                            price={item.price ? item.price.toLocaleString() : "Liên hệ"}
                            originalPrice={item.originalPrice ? item.originalPrice.toLocaleString() : null}
                            description={item.description ?
                                (Array.isArray(item.description) ? item.description.join(" ") : item.description)
                                : "Không có mô tả"}
                            image={item.image || "/default-product.png"}
                            brand={item.brand || "No Brand"}
                        />
                    ))
                ) : (
                    <p className="no-products">Không có sản phẩm nào trong danh mục này.</p>
                )}
            </div>
        </div>
    );
};

export default ProductDisplay;
