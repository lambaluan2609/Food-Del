import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./RecipeDetails.css";

const RecipeDetails = () => {
    const { id } = useParams(); // Lấy ID từ URL
    const [recipe, setRecipe] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/api/foods/details/${id}`)
            .then((res) => res.json())
            .then((data) => setRecipe(data));
    }, [id]);

    if (!recipe) {
        return <h2>Đang tải...</h2>;
    }

    return (
        <div className="recipe-details">
            <h1>{recipe.name}</h1>
            <img src={recipe.image} alt={recipe.name} />
            <p><strong>Giá:</strong> {recipe.price} VNĐ</p>
            <h2>Mô tả</h2>
            <p>{recipe.description}</p>
            <h2>Nguyên liệu</h2>
            <ul>
                {recipe.ingredients.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <h2>Cách nấu</h2>
            <ol>
                {recipe.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                ))}
            </ol>
        </div>
    );
};

export default RecipeDetails;
