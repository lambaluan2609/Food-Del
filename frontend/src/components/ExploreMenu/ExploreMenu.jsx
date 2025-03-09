import React from "react";
import "./ExploreMenu.css";
import { menu_list } from "../../assets/assets";

const ExploreMenu = ({ category, setCategory, setPage }) => {
    const handleCategoryClick = (menuName) => {
        setCategory((prev) => (prev === menuName ? "All" : menuName));
        setPage(1); // 🔥 Reset về trang đầu tiên khi đổi danh mục
    };

    return (
        <div className="explore-menu" id="explore-menu">
            <h1>Khám phá công thức nấu ăn</h1>
            <div className="explore-menu-list">
                {menu_list.map((item, index) => (
                    <div
                        key={index}
                        onClick={() => handleCategoryClick(item.menu_name)}
                        className="explore-menu-list-item"
                    >
                        <img
                            className={category === item.menu_name ? "active" : ""}
                            src={item.menu_image}
                            alt={item.menu_name}
                        />
                        <p>{item.menu_name}</p>
                    </div>
                ))}
            </div>
            <hr />
        </div>
    );
};

export default ExploreMenu;
