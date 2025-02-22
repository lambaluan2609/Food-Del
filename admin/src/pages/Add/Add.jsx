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
        category: "Salad",
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
                    category: "Salad",
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
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
                </div>

                <div className="add-product-name flex-col">
                    <p>Recipe Name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Enter name' required />
                </div>

                <div className="add-product-description flex-col">
                    <p>Description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="4" placeholder='Enter description' required></textarea>
                </div>

                <div className="add-category-price">
                    <div className='add-category flex-col'>
                        <p>Category</p>
                        <select onChange={onChangeHandler} name="category">
                            <option value="Salad">Salad</option>
                            <option value="Rolls">Rolls</option>
                            <option value="Desserts">Desserts</option>
                            <option value="Sandwich">Sandwich</option>
                            <option value="Cake">Cake</option>
                            <option value="Pure Veg">Pure Veg</option>
                            <option value="Pasta">Pasta</option>
                            <option value="Noodles">Noodles</option>
                        </select>
                    </div>
                </div>

                <div className="add-product-details">
                    <div className="add-ingredients flex-col">
                        <p>Ingredients</p>
                        <textarea onChange={onChangeHandler} value={data.ingredients} name="ingredients" rows="3" placeholder='List ingredients' required></textarea>
                    </div>

                    <div className="add-steps flex-col">
                        <p>Steps</p>
                        <textarea onChange={onChangeHandler} value={data.steps} name="steps" rows="4" placeholder='Describe steps' required></textarea>
                    </div>

                    <div className="add-meta flex-col">
                        <p>Cooking Time (minutes)</p>
                        <input onChange={onChangeHandler} value={data.cookingTime} type="number" name="cookingTime" placeholder='30' required />
                    </div>
                    <div className="add-meta flex-col">
                        <p>Calories (cal)</p>
                        <input onChange={onChangeHandler} value={data.calories} type="number" name="calories" placeholder='100' required />
                    </div>
                    <div className="add-meta flex-col">
                        <p>Servings</p>
                        <input onChange={onChangeHandler} value={data.servings} type="number" name="servings" placeholder='2' required />
                    </div>

                    <div className="add-meta flex-col">
                        <p>Difficulty</p>
                        <select onChange={onChangeHandler} name="difficulty">
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>
                    </div>

                    <div className="add-meta flex-col">
                        <p>Author</p>
                        <input onChange={onChangeHandler} value={data.author} type="text" name="author" placeholder='Enter author name' required />
                    </div>
                    <div className="add-meta flex-col">
                        <p>Youtube URL</p>
                        <input onChange={onChangeHandler} value={data.youtubeUrl} type="text" name="youtubeUrl" placeholder='Enter youtube url' required />
                    </div>
                </div>

                <button type='submit' className='add-btn'>ADD RECIPE</button>
            </form>
        </div>
    );
};

export default Add;
