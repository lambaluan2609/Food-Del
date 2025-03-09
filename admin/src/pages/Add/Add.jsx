import React, { useState } from 'react';
import './Add.css';
import { assets } from '../../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify';

const Add = ({ url }) => {
    const [image, setImage] = useState(false);
    const [data, setData] = useState({
        name: "",
        description: "",
        category: "Món chính",
        ingredients: "",
        steps: "",
        cookingTime: "",
        calories: "",
        servings: "",
        difficulty: "Easy",
        author: "",
        youtubeUrl: ""
    });

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        for (const key in data) {
            formData.append(key, data[key]);
        }
        formData.append("image", image);

        try {
            const response = await axios.post(`${url}/api/food/add`, formData);
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    category: "Món chính",
                    ingredients: "",
                    steps: "",
                    cookingTime: "",
                    calories: "",
                    servings: "",
                    difficulty: "Easy",
                    author: "",
                    youtubeUrl: ""
                });
                setImage(false);
                toast.success(response.data.message);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Error adding food:", error);
            toast.error("Failed to add food recipe");
        }
    };

    return (
        <div className='add'>
            <form className="flex-col" onSubmit={onSubmitHandler}>
                <div className="add-img-upload flex-col">
                    <p>Tải hình ảnh</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
                </div>

                <div className="add-product-name flex-col">
                    <p>Tên công thức</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Enter name' required />
                </div>

                <div className="add-product-description flex-col">
                    <p>Mô tả</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="4" placeholder='Enter description' required></textarea>
                </div>

                <div className="add-category-price">
                    <div className='add-category flex-col'>
                        <p>Phân loại</p>
                        <select onChange={onChangeHandler} name="category">
                            <option value="Món chính">Món chính</option>
                            <option value="Healthy">Healthy</option>
                            <option value="Chay">Thuần chay</option>
                            <option value="Ăn vặt">Ăn vặt</option>
                            <option value="Món nước">Món nước</option>
                            <option value="Thức uống">Thức uống</option>

                        </select>
                    </div>
                </div>

                <div className="add-product-details">
                    <div className="add-ingredients flex-col">
                        <p>Nguyên liệu</p>
                        <textarea onChange={onChangeHandler} value={data.ingredients} name="ingredients" rows="3" placeholder='List ingredients' required></textarea>
                    </div>

                    <div className="add-steps flex-col">
                        <p>Các bước thực hiện</p>
                        <textarea onChange={onChangeHandler} value={data.steps} name="steps" rows="4" placeholder='Describe steps' required></textarea>
                    </div>

                    <div className="add-meta flex-col">
                        <p>Thời gian nấu (phút)</p>
                        <input onChange={onChangeHandler} value={data.cookingTime} type="number" name="cookingTime" placeholder='30' required />
                    </div>
                    <div className="add-meta flex-col">
                        <p>Lượng Calories (cal)</p>
                        <input onChange={onChangeHandler} value={data.calories} type="number" name="calories" placeholder='100' required />
                    </div>
                    <div className="add-meta flex-col">
                        <p>Khẩu phần</p>
                        <input onChange={onChangeHandler} value={data.servings} type="number" name="servings" placeholder='2' required />
                    </div>

                    <div className="add-meta flex-col">
                        <p>Độ khó</p>
                        <select onChange={onChangeHandler} name="difficulty">
                            <option value="Easy">Dễ</option>
                            <option value="Medium">Vừa</option>
                            <option value="Hard">Khó</option>
                        </select>
                    </div>

                    <div className="add-meta flex-col">
                        <p>Tác giả</p>
                        <input onChange={onChangeHandler} value={data.author} type="text" name="author" placeholder='Enter author name' required />
                    </div>
                    <div className="add-meta flex-col">
                        <p>Youtube URL</p>
                        <input onChange={onChangeHandler} value={data.youtubeUrl} type="text" name="youtubeUrl" placeholder='Enter youtube url' />
                    </div>
                </div>

                <button type='submit' className='add-btn'>ADD RECIPE</button>
            </form>
        </div>
    );
};

export default Add;
