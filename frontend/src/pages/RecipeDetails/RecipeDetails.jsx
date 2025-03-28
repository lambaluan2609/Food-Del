import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { FaClock, FaStar, FaAppleAlt, FaUserAlt } from 'react-icons/fa';
import './RecipeDetails.css';

// Custom hook cho scroll animation

const useScrollAnimation = (deps = []) => {
    const [isVisible, setIsVisible] = useState(false)
    const elementRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.unobserve(entry.target)
                }
            },
            {
                root: null,
                rootMargin: '0px 0px -20px 0px',
                threshold: 0.01
            }
        )

        const currentElement = elementRef.current
        if (currentElement) observer.observe(currentElement)

        return () => {
            if (currentElement) observer.unobserve(currentElement)
        }
    }, [deps])

    return [isVisible, elementRef]
}
const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [error, setError] = useState(null);
    const [animatedValues, setAnimatedValues] = useState({
        cookingTime: 0,
        calories: 0,
        servings: 0
    });

    // Scroll animations cho các section
    const [isDescVisible, descRef] = useScrollAnimation([id])
    const [isIngredientsVisible, ingredientsRef] = useScrollAnimation([id])
    const [isStepsVisible, stepsRef] = useScrollAnimation([id])
    const [isVideoVisible, videoRef] = useScrollAnimation([id])
    const [isAuthorVisible, authorRef] = useScrollAnimation([id])

    const url = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const response = await fetch(url + `/api/food/detail/${id}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const result = await response.json();
                if (!result.success) throw new Error('Failed to fetch recipe data');
                setRecipe(result.data);
                setError(null);
            } catch (error) {
                console.error("Error fetching recipe:", error);
                setError(error.message);
                setRecipe(null);
            }
        };
        fetchRecipe();
    }, [id]);

    useEffect(() => {
        // Reset scroll về đầu trang khi mount component
        window.scrollTo(0, 0)

        // Force re-check vị trí các element sau 100ms
        const timer = setTimeout(() => {
            window.dispatchEvent(new Event('scroll'))
        }, 100)

        return () => clearTimeout(timer)
    }, [id])

    // Animation cho số
    useEffect(() => {
        if (!recipe) return;

        const animateValue = (start, end, duration, updateCallback) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                const value = Math.floor(progress * (end - start) + start);
                updateCallback(value);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                }
            };
            window.requestAnimationFrame(step);
        };

        animateValue(0, recipe.cookingTime, 2000, (value) =>
            setAnimatedValues(prev => ({ ...prev, cookingTime: value }))
        );
        animateValue(0, recipe.calories, 2000, (value) =>
            setAnimatedValues(prev => ({ ...prev, calories: value }))
        );
        animateValue(0, recipe.servings, 2000, (value) =>
            setAnimatedValues(prev => ({ ...prev, servings: value }))
        );
    }, [recipe]);

    const renderRating = (rating) => {
        return Array(5).fill().map((_, i) => (
            <FaStar key={i} className={i < rating ? 'star-filled' : 'star-empty'} />
        ));
    };

    if (error) {
        return (
            <div className="error-container">
                <h3>⚠️ Lỗi tải công thức</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Thử lại</button>
            </div>
        );
    }

    if (!recipe) {
        return <div className="loading">Đang tải công thức...</div>;
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
            <section
                className={`description-section ${isDescVisible ? 'visible' : ''}`}
                ref={descRef}
            >
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
                        <p>{animatedValues.cookingTime} phút</p>
                    </div>
                </div>
                <div className="info-item">
                    <FaAppleAlt className="info-icon" />
                    <div>
                        <h3>Lượng calories</h3>
                        <p>{animatedValues.calories} kcal</p>
                    </div>
                </div>
                <div className="info-item">
                    <FaUserAlt className="info-icon" />
                    <div>
                        <h3>Khẩu phần</h3>
                        <p>{animatedValues.servings} người</p>
                    </div>
                </div>
                <div className="info-item">
                    <FaUserAlt className="info-icon" />
                    <div>
                        <h3>Lượng Calories theo khẩu phần</h3>
                        <p>{animatedValues.calories / animatedValues.servings} kcal/ người</p>
                    </div>
                </div>
            </div>

            {/* Ingredients Section */}
            <section
                className={`ingredients-section ${isIngredientsVisible ? 'visible' : ''}`}
                ref={ingredientsRef}
            >
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
            <section
                className={`steps-section ${isStepsVisible ? 'visible' : ''}`}
                ref={stepsRef}
            >
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
                <div
                    className={`video-section ${isVideoVisible ? 'visible' : ''}`}
                    ref={videoRef}
                >
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
            <div
                className={`author-section ${isAuthorVisible ? 'visible' : ''}`}
                ref={authorRef}
            >
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