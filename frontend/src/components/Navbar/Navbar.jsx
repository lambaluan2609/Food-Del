import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import assets from '../../assets/assets';
import { StoreContext } from '../../context/StoreContext';

const Navbar = ({ setShowLogin }) => {
    const [menu, setMenu] = useState("home");
    const { getTotalCartAmount, token, setToken } = useContext(StoreContext);
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL; // Ensure your .env file contains the API URL

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    };

    // Function to fetch search results
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            setShowDropdown(false);
            return;
        }

        const fetchSearchResults = async () => {
            try {
                const response = await fetch(`${API_URL}/api/food/search?name=${searchQuery}`);
                const data = await response.json();

                if (data.success) {
                    setSearchResults(data.data);
                    setShowDropdown(true);
                } else {
                    setSearchResults([]);
                    setShowDropdown(false);
                }
            } catch (error) {
                console.error("Error fetching search results:", error);
                setSearchResults([]);
                setShowDropdown(false);
            }
        };

        const delayDebounce = setTimeout(fetchSearchResults, 300); // Debounce API calls
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);


    // Xử lý chuyển hướng khi chọn món ăn từ danh sách
    const handleSelectRecipe = (id) => {
        navigate(`/detail/${id}`);
        setSearchQuery("");
        setSearchResults([]);
        setShowDropdown(false);
    };

    // Xử lý khi nhấn Enter để chuyển đến trang tìm kiếm
    const handleSearchSubmit = (e) => {
        if (e.key === "Enter") {
            if (searchQuery.trim() === "") {
                return; // Nếu ô tìm kiếm trống, không làm gì cả
            }
            navigate(`/search?query=${searchQuery}`);
            setShowDropdown(false);
        }
    };

    return (
        <div className='navbar'>
            <div className='navbar-left'>
                <Link to={'/'}><img src={assets.logo} alt='Logo' className='logo' /></Link>
            </div>

            <div className='navbar-center'>
                <ul className='navbar-menu'>
                    <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Trang chủ</Link>
                    <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Menu</a>
                    <a href='#about-us' onClick={() => setMenu("about-us")} className={menu === "about-us" ? "active" : ""}>Sản phẩm</a>
                    <a href='#footer' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Liên hệ</a>
                </ul>
            </div>

            <div className='navbar-right'>
                <div className='navbar-search'>
                    <input
                        type='text'
                        placeholder='Tìm kiếm món ăn...'
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchSubmit}  // Add this line to bind the functio
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                    />

                    {/* Search Results Dropdown */}
                    {showDropdown && searchResults.length > 0 && (
                        <div className='search-dropdown'>
                            {searchResults.map((recipe) => (
                                <div
                                    key={recipe._id}
                                    className='search-result-item'
                                    onClick={() => handleSelectRecipe(recipe._id)}
                                >
                                    <img src={recipe.image} alt={recipe.name} className='search-result-image' />
                                    <span className='search-result-name'>{recipe.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className='navbar-cart'>
                    <Link to='/cart'><img src={assets.basket_icon} alt='Cart' /></Link>
                    {getTotalCartAmount() > 0 && <div className='dot'></div>}
                </div>

                {!token ? (
                    <button onClick={() => setShowLogin(true)}>Đăng nhập</button>
                ) : (
                    <div className='navbar-profile'>
                        <img src={assets.profile_icon} alt='Profile' />
                        <ul className='nav-profile-dropdown'>
                            <li onClick={() => navigate("/myorders")}><img src={assets.bag_icon} alt='' />Giỏ hàng</li>
                            <hr />
                            <li onClick={logout}><img src={assets.logout_icon} alt='' /><p>Đăng xuất</p></li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;
