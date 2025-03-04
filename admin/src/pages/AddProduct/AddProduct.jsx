import React, { useState } from 'react';
import './AddProduct.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddProduct = ({ url }) => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        category: "Thực phẩm",
        originalPrice: "",
        price: "",
        stock: "",
        brand: "",
        origin: "",
        ingredients: "",
        usageInstructions: "",
        storageInstructions: "",
    });

    // Xử lý thay đổi input
    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    // Xử lý gửi form
    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();

        // Nếu không nhập giá khuyến mãi, gán bằng giá niêm yết
        const finalPrice = data.price.trim() === "" ? data.originalPrice : data.price;

        const productData = {
            ...data,
            price: finalPrice  // Gán giá khuyến mãi hoặc lấy giá niêm yết nếu khuyến mãi không có
        };

        for (const key in productData) {
            formData.append(key, productData[key]);
        }
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/product/add`, formData);
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    category: "Thực phẩm",
                    originalPrice: "",
                    price: "",
                    stock: "",
                    brand: "",
                    origin: "",
                    ingredients: "",
                    usageInstructions: "",
                    storageInstructions: "",
                });
                setImage(false);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error adding product:", error);
            toast.error("Failed to add product");
        }
    };

    return (
        <div className='add-product'>
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Tải hình ảnh</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
                </div>

                <div className="add-product-name flex-col">
                    <p>Tên sản phẩm</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Nhập tên sản phẩm' required />
                </div>

                <div className="add-product-description flex-col">
                    <p>Mô tả</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="4" placeholder='Nhập mô tả sản phẩm' required></textarea>
                </div>

                <div className="add-category flex-col">
                    <p>Phân loại</p>
                    <select onChange={onChangeHandler} name="category">
                        <option value="Thực phẩm">Thực phẩm</option>
                        <option value="Đồ uống">Đồ uống</option>
                        <option value="Gia vị">Gia vị</option>
                    </select>
                </div>

                <div className='add-meta flex-col'>
                    <p>Giá niêm yết (VND)</p>
                    <input onChange={onChangeHandler} value={data.originalPrice} type='number' name='originalPrice' placeholder='100000' required />
                </div>

                <div className="add-meta flex-col">
                    <p>Giá khuyến mãi (VND) <span className="optional-text">(Bỏ trống nếu không có giảm giá)</span></p>
                    <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder='100000' />
                </div>

                <div className="add-meta flex-col">
                    <p>Số lượng tồn kho</p>
                    <input onChange={onChangeHandler} value={data.stock} type="number" name="stock" placeholder='50' required />
                </div>

                <div className="add-meta flex-col">
                    <p>Thương hiệu</p>
                    <input onChange={onChangeHandler} value={data.brand} type="text" name="brand" placeholder='Nhập thương hiệu' required />
                </div>

                <div className="add-meta flex-col">
                    <p>Xuất xứ</p>
                    <input onChange={onChangeHandler} value={data.origin} type="text" name="origin" placeholder='Nhập xuất xứ' />
                </div>

                <div className="add-meta flex-col">
                    <p>Thành phần</p>
                    <input onChange={onChangeHandler} value={data.ingredients} type="text" name="ingredients" placeholder='Nhập thành phần' />
                </div>

                <div className="add-meta flex-col">
                    <p>Hướng dẫn sử dụng</p>
                    <input onChange={onChangeHandler} value={data.usageInstructions} type="text" name="usageInstructions" placeholder='Nhập hướng dẫn sử dụng' />
                </div>

                <div className="add-meta flex-col">
                    <p>Hướng dẫn bảo quản</p>
                    <input onChange={onChangeHandler} value={data.storageInstructions} type="text" name="storageInstructions" placeholder='Nhập hướng dẫn bảo quản' />
                </div>

                <button type='submit' className='add-btn'>THÊM SẢN PHẨM</button>
            </form>
        </div>
    );
};

export default AddProduct;
