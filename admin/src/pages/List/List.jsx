import React, { useEffect, useState } from "react";
import "./List.css";
import axios from "axios";
import { toast } from "react-toastify";
import EditPopup from "../EditPopup/EditPopup"; // Import Popup

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editItem, setEditItem] = useState(null); // State để lưu item cần chỉnh sửa
  const limit = 10;

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
        fetchList();
      } else {
        toast.error("Error removing food");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove food");
    }
  };

  const handleUpdate = (updatedItem) => {
    setList((prevList) => prevList.map((item) => (item._id === updatedItem._id ? updatedItem : item)));
    setEditItem(null);
  };

  useEffect(() => {
    fetchList();
  }, [page]);

  return (
    <div className="list add flex-col">
      <p>Tất cả công thức</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>STT</b>
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
            <div key={item._id} className="list-table-format">
              <p>{(page - 1) * limit + index + 1}</p>
              <img src={item.image} alt={item.name} />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.difficulty}</p>
              <div>
                <button onClick={() => setEditItem(item)} className="edit-btn">Edit</button>
                <p onClick={() => removeFood(item._id)} className="cursor">X</p>
              </div>
            </div>
          ))
        )}
      </div>
      <p>{`Tổng số công thức: ${totalItems}`}</p>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>

      {editItem && (
        <EditPopup
          url={url}
          type="food"
          item={editItem}
          onClose={() => setEditItem(null)}
          onUpdate={handleUpdate}
        />
      )}
    </div>
  );
};

export default List;