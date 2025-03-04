import React, { useContext } from 'react'
import assets from '../../assets/assets'
import './FoodItem.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom'

const FoodItem = ({ id, name, description, image }) => {

    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);
    const navigate = useNavigate()

    return (
        <div className='food-item' onClick={() => navigate(`/detail/${id}`)}>
            <div className="food-item-image-container">
                <img className='food-item-image' src={image} alt="" />
                {!cartItems[id]
                    ? <img className='add' onClick={(e) => {
                        e.stopPropagation(); // Ngăn không trigger navigate
                        addToCart(id)
                    }} src={assets.add_icon_white} alt="" />
                    : <div className='food-item-counter'>
                        <img onClick={(e) => {
                            e.stopPropagation();
                            removeFromCart(id)
                        }} src={assets.remove_icon_red} alt="" />
                        <p>{cartItems[id]}</p>
                        <img onClick={(e) => {
                            e.stopPropagation();
                            addToCart(id)
                        }} src={assets.add_icon_green} alt="" />
                    </div>
                }
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    <img src={assets.rating_starts} alt="" />
                </div>
                <p className="food-item-desc">{description}</p>


            </div>
        </div>
    )
}

export default FoodItem
