import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import EditPopup from "../EditPopup/EditPopup";
import "./List.css";

const List = ({ url }) => {
  const [list, setList] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editItem, setEditItem] = useState(null);
  const limit = 10;

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list?page=${page}&limit=${limit}`);
      if (response.data.success) {
        setList(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
      } else {
        toast.error("Lỗi khi tải danh sách công thức");
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách công thức");
    }
  };

  const removeFood = async (foodId) => {
    try {
      if (!window.confirm("Bạn có chắc muốn xóa công thức này không?")) return;
      const response = await axios.delete(`${url}/api/food/remove/${foodId}`, {
        data: { id: foodId },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList();
      } else {
        toast.error("Lỗi khi xóa công thức");
      }
    } catch (error) {
      console.error(error);
      toast.error("Không thể xóa công thức");
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
    <div className="list">
      <h2 className="list-title">Tất cả công thức</h2>
      <p className="total-items">{`Tổng số công thức: ${totalItems}`}</p>

      <table className="food-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Hình ảnh</th>
            <th>Tên công thức</th>
            <th>Phân loại</th>
            <th>Độ khó</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-data">
                Không tìm thấy công thức nào
              </td>
            </tr>
          ) : (
            list.map((item, index) => (
              <tr key={item._id}>
                <td>{(page - 1) * limit + index + 1}</td>
                <td>
                  <img src={item.image} alt={item.name} className="food-image" />
                </td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.difficulty}</td>
                <td>
                  <button onClick={() => setEditItem(item)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => removeFood(item._id)} className="remove-btn">
                    X
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button
          className="pagination-btn"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Trang trước
        </button>
        <span className="pagination-info">
          Trang {page} / {totalPages}
        </span>
        <button
          className="pagination-btn"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Trang sau
        </button>
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