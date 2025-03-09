// import React, { useState, useEffect } from 'react';
// import './Add.css';
// import { assets } from '../../assets/assets';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useParams, useNavigate } from 'react-router-dom';

// const Update = ({ url }) => {
//     const { id } = useParams(); // Lấy ID từ URL
//     const navigate = useNavigate();
//     const [image, setImage] = useState(false);
//     const [data, setData] = useState({
//         name: "",
//         description: "",
//         category: "Món chính",
//         ingredients: "",
//         steps: "",
//         cookingTime: "",
//         calories: "",
//         servings: "",
//         difficulty: "Easy",
//         author: "",
//         youtubeUrl: ""
//     });

//     useEffect(() => {
//         const fetchFoodDetail = async () => {
//             try {
//                 const response = await axios.get(`${url}/api/food/detail/${id}`);
//                 if (response.data.success) {
//                     setData(response.data.food);
//                 } else {
//                     toast.error(response.data.message);
//                 }
//             } catch (error) {
//                 console.error("Error fetching food details:", error);
//                 toast.error("Failed to fetch food details");
//             }
//         };

//         fetchFoodDetail();
//     }, [id, url]);

//     const onChangeHandler = (event) => {
//         const { name, value } = event.target;
//         setData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     const onSubmitHandler = async (event) => {
//         event.preventDefault();
//         const formData = new FormData();
//         for (const key in data) {
//             formData.append(key, data[key]);
//         }
//         formData.append("image", image);

//         try {
//             const response = await axios.put(`${url}/api/food/update/${id}`, formData);
//             if (response.data.success) {
//                 toast.success(response.data.message);
//                 navigate('/list'); // Điều hướng về trang danh sách sau khi cập nhật thành công
//             } else {
//                 toast.error(response.data.message);
//             }
//         } catch (error) {
//             console.error("Error updating food:", error);
//             toast.error("Failed to update food recipe");
//         }
//     };

//     return (
//         <div className='add'>
//             <form className="flex-col" onSubmit={onSubmitHandler}>
//                 <div className="add-img-upload flex-col">
//                     <p>Tải hình ảnh</p>
//                     <label htmlFor="image">
//                         <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
//                     </label>
//                     <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' hidden />
//                 </div>

//                 <div className="add-product-name flex-col">
//                     <p>Tên công thức</p>
//                     <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Enter name' required />
//                 </div>

//                 <div className="add-product-description flex-col">
//                     <p>Mô tả</p>
//                     <textarea onChange={onChangeHandler} value={data.description} name="description" rows="4" placeholder='Enter description' required></textarea>
//                 </div>

//                 <div className="add-category-price">
//                     <div className='add-category flex-col'>
//                         <p>Phân loại</p>
//                         <select onChange={onChangeHandler} name="category" value={data.category}>
//                             <option value="Món chính">Món chính</option>
//                             <option value="Healthy">Healthy</option>
//                             <option value="Chay">Thuần chay</option>
//                             <option value="Ăn vặt">Ăn vặt</option>
//                             <option value="Món nước">Món nước</option>
//                             <option value="Thức uống">Thức uống</option>
//                         </select>
//                     </div>
//                 </div>

//                 <div className="add-product-details">
//                     <div className="add-ingredients flex-col">
//                         <p>Nguyên liệu</p>
//                         <textarea onChange={onChangeHandler} value={data.ingredients} name="ingredients" rows="3" placeholder='List ingredients' required></textarea>
//                     </div>

//                     <div className="add-steps flex-col">
//                         <p>Các bước thực hiện</p>
//                         <textarea onChange={onChangeHandler} value={data.steps} name="steps" rows="4" placeholder='Describe steps' required></textarea>
//                     </div>

//                     <div className="add-meta flex-col">
//                         <p>Thời gian nấu (phút)</p>
//                         <input onChange={onChangeHandler} value={data.cookingTime} type="number" name="cookingTime" placeholder='30' required />
//                     </div>
//                     <div className="add-meta flex-col">
//                         <p>Lượng Calories (cal)</p>
//                         <input onChange={onChangeHandler} value={data.calories} type="number" name="calories" placeholder='100' required />
//                     </div>
//                     <div className="add-meta flex-col">
//                         <p>Khẩu phần</p>
//                         <input onChange={onChangeHandler} value={data.servings} type="number" name="servings" placeholder='2' required />
//                     </div>

//                     <div className="add-meta flex-col">
//                         <p>Độ khó</p>
//                         <select onChange={onChangeHandler} name="difficulty" value={data.difficulty}>
//                             <option value="Easy">Dễ</option>
//                             <option value="Medium">Vừa</option>
//                             <option value="Hard">Khó</option>
//                         </select>
//                     </div>

//                     <div className="add-meta flex-col">
//                         <p>Tác giả</p>
//                         <input onChange={onChangeHandler} value={data.author} type="text" name="author" placeholder='Enter author name' required />
//                     </div>
//                     <div className="add-meta flex-col">
//                         <p>Youtube URL</p>
//                         <input onChange={onChangeHandler} value={data.youtubeUrl} type="text" name="youtubeUrl" placeholder='Enter youtube url' />
//                     </div>
//                 </div>

//                 <button type='submit' className='add-btn'>UPDATE RECIPE</button>
//             </form>
//         </div>
//     );
// };

// export default Update;
