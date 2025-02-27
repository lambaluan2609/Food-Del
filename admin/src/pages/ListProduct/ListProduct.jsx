import React, { useEffect, useState } from "react";
import "./ListProduct.css";
import axios from "axios";
import { toast } from "react-toastify";

const ListProduct = ({ url }) => {
    const [list, setList] = useState([]);

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/api/product/list`);
            if (response.data.success) {
                setList(response.data.data);
            } else {
                toast.error("Error fetching product list");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to load product list");
        }
    };

    const removeProduct = async (productId) => {
        try {
            const response = await axios.delete(`${url}/api/product/remove`, {
                data: { id: productId },
            });

            if (response.data.success) {
                toast.success(response.data.message);
                fetchList();
            } else {
                toast.error("Error removing product");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to remove product");
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="list add flex-col">
            <p>All Products List</p>
            <div className="list-table">
                <div className="list-table-format title">
                    <b>Image</b>
                    <b>Name</b>
                    <b>Category</b>
                    <b>Price</b>
                    <b>Stock</b>
                    <b>Action</b>
                </div>
                {list.map((item, index) => (
                    <div key={index} className="list-table-format">
                        <img src={item.image} alt={item.name} />
                        <p>{item.name}</p>
                        <p>{item.category}</p>
                        <p>{item.price.toLocaleString()} VND</p>
                        <p>{item.stock}</p>
                        <p onClick={() => removeProduct(item._id)} className="cursor">
                            X
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ListProduct;
