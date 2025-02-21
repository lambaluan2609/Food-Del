// src/pages/RecipeDetails/RecipeDetails.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './RecipeDetails.css'

const RecipeDetails = () => {
    const { id } = useParams() // Lấy id từ URL
    const [foodItem, setFoodItem] = useState(null)

    useEffect(() => {
        fetch(`/api/food/detail/${id}`)
            .then(res => res.json())
            .then(data => setFoodItem(data))
            .catch(err => console.error(err))
    }, [id])

    if (!foodItem) {
        return <p>Loading...</p>
    }

    return (
        <div className='recipe-details'>
            <h1>{foodItem.name}</h1>
            <img src={foodItem.image} alt={foodItem.name} />
            <p>{foodItem.description}</p>
            <p>Price: ${foodItem.price}</p>
        </div>
    )
}

export default RecipeDetails
