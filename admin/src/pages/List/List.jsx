import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10; // 🔥 Giới hạn số món ăn hiển thị trên mỗi trang

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list?page=${page}&limit=${limit}`);
      if (response.data.success) {
        setList(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
      } else {
        toast.error("Error fetching food list");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load food list");
    }
  };

  const removeFood = async (foodId) => {
    try {
      if (!window.confirm("Are you sure you want to remove this food?")) return;

      const response = await axios.delete(`${url}/api/food/remove/${foodId}`, {
        data: { id: foodId },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // 🔥 Tự động làm mới danh sách sau khi xóa
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove food");
    }
  };

  useEffect(() => {
    fetchList();
  }, [page]);

  return (
    <div className="list add flex-col">
      <p>Tất cả công thức</p>

      <div className="list-table">
        {/* 🏆 Thêm cột STT */}
        <div className="list-table-format title">
          <b>STT</b> {/* ✅ Thêm tiêu đề số thứ tự */}
          <b>Hình ảnh</b>
          <b>Tên công thức</b>
          <b>Phân loại</b>
          <b>Độ khó</b>
          <b>Action</b>
        </div>

        {list.length === 0 ? (
          <p className="no-data">No food recipes found</p>
        ) : (
          list.map((item, index) => (
            <div key={index} className="list-table-format">
              <p>{(page - 1) * limit + index + 1}</p> {/* ✅ Tính toán STT */}
              <img src={item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.difficulty}</p>
              <p onClick={() => removeFood(item._id)} className="cursor">
                X
              </p>
            </div>
          ))
        )}
      </div>
      <p>{`Tổng số công thức: ${totalItems}`}</p>
      {/* 🔥 Pagination Controls */}
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

export default List;
