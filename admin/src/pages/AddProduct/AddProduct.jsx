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
        price: "",
        stock: "",
        brand: "",
        origin: "",
        ingredients: "",
        usageInstructions: "",
        storageInstructions: "",
        // weight: "",
        // discount: "",
        // ratings: "",
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
            const response = await axios.post(`${url}/api/product/add`, formData);
            if (response.data.success) {
                setData({
                    name: "",
                    description: "",
                    category: "Thực phẩm",
                    price: "",
                    stock: "",
                    brand: "",
                    origin: "",
                    ingredients: "",
                    usageInstructions: "",
                    storageInstructions: "",
                    // weight: "",
                    // discount: "",
                    // ratings: "",
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
                    <p>Upload Image</p>
                    <label htmlFor="image">
                        <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden required />
                </div>

                <div className="add-product-name flex-col">
                    <p>Product Name</p>
                    <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Enter name' required />
                </div>

                <div className="add-product-description flex-col">
                    <p>Description</p>
                    <textarea onChange={onChangeHandler} value={data.description} name="description" rows="4" placeholder='Enter description' required></textarea>
                </div>

                <div className="add-category flex-col">
                    <p>Category</p>
                    <select onChange={onChangeHandler} name="category">
                        <option value="Thực phẩm">Thực phẩm</option>
                        <option value="Đồ uống">Đồ uống</option>
                        <option value="Gia vị">Gia vị</option>
                        <option value="Hóa phẩm">Hóa phẩm</option>
                        <option value="Đồ dùng gia đình">Đồ dùng gia đình</option>
                    </select>
                </div>

                <div className="add-meta flex-col">
                    <p>Price (VND)</p>
                    <input onChange={onChangeHandler} value={data.price} type="number" name="price" placeholder='100000' required />
                </div>

                <div className="add-meta flex-col">
                    <p>Stock</p>
                    <input onChange={onChangeHandler} value={data.stock} type="number" name="stock" placeholder='50' required />
                </div>

                <div className="add-meta flex-col">
                    <p>Brand</p>
                    <input onChange={onChangeHandler} value={data.brand} type="text" name="brand" placeholder='Brand Name' required />
                </div>

                <div className="add-meta flex-col">
                    <p>Origin</p>
                    <input onChange={onChangeHandler} value={data.origin} type="text" name="origin" placeholder='Country of Origin' />
                </div>

                <div className="add-meta flex-col">
                    <p>Ingredients</p>
                    <input onChange={onChangeHandler} value={data.ingredients} type="text" name="ingredients" placeholder='Ingredients' />
                </div>

                <div className="add-meta flex-col">
                    <p>Usage Instructions</p>
                    <input onChange={onChangeHandler} value={data.usageInstructions} type="text" name="usageInstructions" placeholder='Usage Instructions' />
                </div>

                <div className="add-meta flex-col">
                    <p>Storage Instructions</p>
                    <input onChange={onChangeHandler} value={data.storageInstructions} type="text" name="storageInstructions" placeholder='Storage Instructions' />
                </div>

                {/* <div className="add-meta flex-col">
                    <p>Weight / Volume</p>
                    <input onChange={onChangeHandler} value={data.weight} type="text" name="weight" placeholder='500g' />
                </div>

                <div className="add-meta flex-col">
                    <p>Discount (%)</p>
                    <input onChange={onChangeHandler} value={data.discount} type="number" name="discount" placeholder='10' />
                </div>

                <div className="add-meta flex-col">
                    <p>Ratings (0-5)</p>
                    <input onChange={onChangeHandler} value={data.ratings} type="number" name="ratings" placeholder='4.5' />
                </div> */}

                <button type='submit' className='add-btn'>ADD PRODUCT</button>
            </form>
        </div>
    );
};

export default AddProduct;
