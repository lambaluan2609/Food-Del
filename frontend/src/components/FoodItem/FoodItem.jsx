import React from 'react';
import assets from '../../assets/assets';
import './FoodItem.css';
import { useNavigate } from 'react-router-dom';

const FoodItem = ({ id, name, description, image }) => {
    const navigate = useNavigate();

    return (
        <div className='food-item' onClick={() => navigate(`/detail/${id}`)}>
            <div className="food-item-image-container">
                <img className='food-item-image' src={image} alt={name} />
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p className="food-item-name">{name}</p>
                    <img src={assets.rating_starts} alt="rating" className="rating-stars" />
                </div>
                <p className="food-item-desc">{description}</p>
            </div>
        </div>
    );
};

export default FoodItem;