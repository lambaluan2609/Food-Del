import React, { useContext, useEffect, useState } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";
import axios from "axios";

const FoodDisplay = ({ category }) => {
  const { url } = useContext(StoreContext); // 🔥 Lấy URL từ StoreContext
  const [foodList, setFoodList] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12; // 🔥 Giới hạn món ăn trên mỗi trang

  const fetchFoodList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`, {
        params: {
          page,
          limit,
          category: category !== "All" ? category : undefined, // 🔥 Chỉ thêm category nếu khác "All"
        },
      });

      if (response.data.success) {
        setFoodList(response.data.data);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error("Error fetching food list:", error);
    }
  };

  useEffect(() => {
    setPage(1); // 🔥 Reset về trang 1 khi đổi category
  }, [category]);

  useEffect(() => {
    fetchFoodList();
  }, [page, category]); // 🔥 Fetch lại khi page hoặc category thay đổi

  useEffect(() => {
    console.log(foodList); // 🔥 Kiểm tra dữ liệu trả về
  }, [foodList]);

  return (
    <div className="food-display" id="food-display">
      <h2>Tất cả công thức</h2>

      <div className="food-display-list">
        {foodList.map((item) => {
          console.log("FoodItem Props:", item); // 🔥 Kiểm tra dữ liệu truyền vào từng FoodItem
          return (
            <FoodItem
              key={item._id}
              id={item._id}
              name={item.name}
              description={item.description ?? "No description"}
              image={item.image}
            />
          );
        })}
      </div>

      {/* 🔥 Pagination với CSS cũ */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Previous
        </button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
};

export default FoodDisplay;
