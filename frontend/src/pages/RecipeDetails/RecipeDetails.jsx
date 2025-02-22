// src/pages/RecipeDetails/RecipeDetails.jsx
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FaClock, FaStar, FaAppleAlt, FaUserAlt } from 'react-icons/fa'
import './RecipeDetails.css'

const RecipeDetails = () => {
    const { id } = useParams()
    const [recipe, setRecipe] = useState(null)
    const [error, setError] = useState(null)
    const url = import.meta.env.VITE_API_URL;
    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(url + `/api/food/detail/${id}`)
                console.log('Response status:', response.status)
                console.log('Response headers:', response.headers.get('content-type'))

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const result = await response.json() // Lỗi có thể nằm ở đây
                console.log('Result data:', result)

                if (!result.success) {
                    throw new Error('Failed to fetch recipe data')
                }

                setRecipe(result.data)
                setError(null)
            } catch (error) {
                console.error("Error fetching recipe:", error)
                setError(error.message)
                setRecipe(null)
            }
        }



        fetchRecipe()
    }, [id])

    const renderRating = (rating) => {
        return Array(5).fill().map((_, i) => (
            <FaStar key={i} className={i < rating ? 'star-filled' : 'star-empty'} />
        ))
    }

    if (error) {
        return (
            <div className="error-container">
                <h3>⚠️ Lỗi tải công thức</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Thử lại</button>
            </div>
        )
    }

    if (!recipe) {
        return <div className="loading">Đang tải công thức...</div>
    }

    return (
        <div className="recipe-container">
            {/* Recipe Header */}
            <header className="recipe-header">
                <h1>{recipe.name}</h1>
                <div className="meta-header">
                    <div className="rating">
                        {renderRating(recipe.ratings)}
                        <span>({recipe.ratings.toFixed(1)})</span>
                    </div>
                    <span className="category">{recipe.category}</span>
                </div>
            </header>

            {/* Main Image */}
            <div className="main-image">
                <img src={recipe.image} alt={recipe.name} />
            </div>

            {/* Description Section */}
            <section className="description-section">
                <h2 className="section-title">Mô tả</h2>
                <div className="description-grid">
                    {recipe.description && (
                        <div className="recipe-description">
                            <p>{recipe.description}</p>
                        </div>
                    )}
                </div>
            </section>



            {/* Quick Info Grid */}
            <div className="quick-info-grid">
                <div className="info-item">
                    <FaClock className="info-icon" />
                    <div>
                        <h3>Thời gian nấu</h3>
                        <p>{recipe.cookingTime} phút</p>
                    </div>
                </div>
                <div className="info-item">
                    <FaAppleAlt className="info-icon" /> {/* Bạn có thể thay bằng icon khác nếu cần */}
                    <div>
                        <h3>Lượng calo</h3>
                        <p>{recipe.calories} cal</p>
                    </div>
                </div>
                <div className="info-item">
                    <FaUserAlt className="info-icon" /> {/* Bạn có thể thay bằng icon khác nếu cần */}
                    <div>
                        <h3>Khẩu phần</h3>
                        <p>{recipe.servings} người</p>
                    </div>
                </div>
                {/* ... các info item khác */}
            </div>

            {/* Ingredients Section */}
            <section className="ingredients-section">
                <h2 className="section-title">Nguyên liệu</h2>
                <div className="ingredients-grid">
                    {recipe.ingredients.map((ingredient, index) => (
                        <div key={index} className="ingredient-item">
                            <div className="bullet"></div>
                            {ingredient}
                        </div>
                    ))}
                </div>
            </section>

            {/* Cooking Steps */}
            <section className="steps-section">
                <h2 className="section-title">Các bước thực hiện</h2>
                <div className="steps-list">
                    {recipe.steps.filter(step => step.trim() !== '').map((step, index) => (
                        <div key={index} className="step-item">
                            <div className="step-number">{index + 1}</div>
                            <p className="step-text">{step.replace(/^\d+\.\s*/, '')}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* YouTube Video */}
            {recipe.youtubeUrl && (
                <div className="video-section">
                    <h2 className="section-title">Video hướng dẫn</h2>
                    <div className="video-wrapper">
                        <iframe
                            src={recipe.youtubeUrl.replace('watch?v=', 'embed/')}
                            title="YouTube video player"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            {/* Author Info */}
            <div className="author-section">
                <p className="author-text">
                    Công thức bởi <span>{recipe.author}</span>
                </p>
                <p className="create-date">
                    Ngày đăng: {new Date(recipe.createdAt).toLocaleDateString('vi-VN')}
                </p>
            </div>
        </div>
    )
}

export default RecipeDetails