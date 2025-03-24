// EditPopup.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './EditPopup.css'; // Tạo file CSS cho popup

const EditPopup = ({ url, type, item, onClose, onUpdate }) => {
    const isFood = type === 'food';
    const initialData = isFood
        ? {
            name: item.name || '',
            description: item.description || '',
            category: item.category || 'Món chính',
            ingredients: item.ingredients || '',
            steps: item.steps || '',
            cookingTime: item.cookingTime || '',
            calories: item.calories || '',
            servings: item.servings || '',
            difficulty: item.difficulty || 'Easy',
            author: item.author || '',
            youtubeUrl: item.youtubeUrl || '',
        }
        : {
            name: item.name || '',
            description: item.description || '',
            category: item.category || 'Thực phẩm',
            originalPrice: item.originalPrice || '',
            price: item.price || '',
            stock: item.stock || '',
            brand: item.brand || '',
            origin: item.origin || '',
            ingredients: item.ingredients || '',
            usageInstructions: item.usageInstructions || '',
            storageInstructions: item.storageInstructions || '',
        };

    const [data, setData] = useState(initialData);
    const [image, setImage] = useState(null);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        const finalData = isFood ? data : { ...data, price: data.price || data.originalPrice };
        for (const key in finalData) {
            formData.append(key, finalData[key]);
        }
        if (image) formData.append('image', image);

        try {
            const endpoint = isFood ? `${url}/api/food/update/${item._id}` : `${url}/api/product/update/${item._id}`;
            const response = await axios.put(endpoint, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.data.success) {
                toast.success(response.data.message);
                onUpdate(response.data.data); // Cập nhật danh sách
                onClose();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(`Error updating ${type}:`, error);
            toast.error(`Failed to update ${type}`);
        }
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Edit {isFood ? 'Food Recipe' : 'Product'}</h2>
                <button className="close-btn" onClick={onClose}>X</button>
                <form className="flex-col" onSubmit={onSubmitHandler}>
                    <div className="add-img-upload flex-col">
                        <p>Tải hình ảnh</p>
                        <label htmlFor="image">
                            <img src={image ? URL.createObjectURL(image) : item.image} alt="" />
                        </label>
                        <input onChange={(e) => setImage(e.target.files[0])} type="file" id="image" hidden />
                    </div>

                    <div className="add-product-name flex-col">
                        <p>{isFood ? 'Tên công thức' : 'Tên sản phẩm'}</p>
                        <input onChange={onChangeHandler} value={data.name} type="text" name="name" required />
                    </div>

                    <div className="add-product-description flex-col">
                        <p>Mô tả</p>
                        <textarea onChange={onChangeHandler} value={data.description} name="description" rows="4" required />
                    </div>

                    <div className="add-category flex-col">
                        <p>Phân loại</p>
                        <select onChange={onChangeHandler} name="category" value={data.category}>
                            {isFood ? (
                                <>
                                    <option value="Món chính">Món chính</option>
                                    <option value="Healthy">Healthy</option>
                                    <option value="Chay">Thuần chay</option>
                                    <option value="Ăn vặt">Ăn vặt</option>
                                    <option value="Món nước">Món nước</option>
                                    <option value="Thức uống">Thức uống</option>
                                </>
                            ) : (
                                <>
                                    <option value="Thực phẩm">Thực phẩm</option>
                                    <option value="Đồ uống">Đồ uống</option>
                                    <option value="Gia vị">Gia vị</option>
                                </>
                            )}
                        </select>
                    </div>

                    {isFood ? (
                        <>
                            <div className="add-ingredients flex-col">
                                <p>Nguyên liệu</p>
                                <textarea onChange={onChangeHandler} value={data.ingredients} name="ingredients" rows="3" required />
                            </div>
                            <div className="add-steps flex-col">
                                <p>Các bước thực hiện</p>
                                <textarea onChange={onChangeHandler} value={data.steps} name="steps" rows="4" required />
                            </div>
                            <div className="add-meta flex-col">
                                <p>Thời gian nấu (phút)</p>
                                <input onChange={onChangeHandler} value={data.cookingTime} type="number" name="cookingTime" required />
                            </div>
                            <div className="add-meta flex-col">
                                <p>Lượng Calories (cal)</p>
                                <input onChange={onChangeHandler} value={data.calories} type="number" name="calories" required />
                            </div>
                            <div className="add-meta flex-col">
                                <p>Khẩu phần</p>
                                <input onChange={onChangeHandler} value={data.servings} type="number" name="servings" required />
                            </div>
                            <div className="add-meta flex-col">
                                <p>Độ khó</p>
                                <select onChange={onChangeHandler} name="difficulty" value={data.difficulty}>
                                    <option value="Easy">Dễ</option>
                                    <option value="Medium">Vừa</option>
                                    <option value="Hard">Khó</option>
                                </select>
                            </div>
                            <div className="add-meta flex-col">
                                <p>Tác giả</p>
                                <input onChange={onChangeHandler} value={data.author} type="text" name="author" required />
                            </div>
                            <div className="add-meta flex-col">
                                <p>Youtube URL</p>
                                <input onChange={onChangeHandler} value={data.youtubeUrl} type="text" name="youtubeUrl" />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="add-meta flex-col">
                                <p>Giá niêm yết (VND)</p>
                                <input onChange={onChangeHandler} value={data.originalPrice} type="number" name="originalPrice" required />
                            </div>
                            <div className="add-meta flex-col">
                                <p>Giá khuyến mãi (VND) <span>(Optional)</span></p>
                                <input onChange={onChangeHandler} value={data.price} type="number" name="price" />
                            </div>
                            <div className="add-meta flex-col">
                                <p>Số lượng tồn kho</p>
                                <input onChange={onChangeHandler} value={data.stock} type="number" name="stock" required />
                            </div>
                            <div className="add-meta flex-col">
                                <p>Thương hiệu</p>
                                <input onChange={onChangeHandler} value={data.brand} type="text" name="brand" required />
                            </div>
                            <div className="add-meta flex-col">
                                <p>Xuất xứ</p>
                                <input onChange={onChangeHandler} value={data.origin} type="text" name="origin" />
                            </div>
                            <div className="add-meta flex-col">
                                <p>Thành phần</p>
                                <textarea onChange={onChangeHandler} value={data.ingredients} name="ingredients" rows="3" />
                            </div>
                            <div className="add-meta flex-col">
                                <p>Hướng dẫn sử dụng</p>
                                <textarea onChange={onChangeHandler} value={data.usageInstructions} name="usageInstructions" rows="3" />
                            </div>
                            <div className="add-meta flex-col">
                                <p>Hướng dẫn bảo quản</p>
                                <textarea onChange={onChangeHandler} value={data.storageInstructions} name="storageInstructions" rows="3" />
                            </div>
                        </>
                    )}

                    <button type="submit" className="add-btn">UPDATE</button>
                </form>
            </div>
        </div>
    );
};

export default EditPopup;