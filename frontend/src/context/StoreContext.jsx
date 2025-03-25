import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const [cartAmount, setCartAmount] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const url = import.meta.env.VITE_API_URL;
    const [token, setToken] = useState("");
    const [foodList, setFoodList] = useState([]);
    const [productList, setProductList] = useState([]);

    // ✅ Hàm tính tổng giá trị giỏ hàng, kiểm tra itemInfo tránh lỗi
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = productList.find((product) => product._id === item);
                if (itemInfo) { // Kiểm tra nếu sản phẩm tồn tại
                    totalAmount += (itemInfo.price || 0) * cartItems[item];
                }
            }
        }
        return totalAmount;
    };

    // ✅ Hàm thêm sản phẩm vào giỏ hàng
    const addToCart = async (itemId) => {
        setCartItems((prev) => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1,
        }));

        if (token) {
            try {
                await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } });
            } catch (error) {
                console.error("Error adding to cart:", error);
            }
        }
    };

    // ✅ Hàm xóa sản phẩm khỏi giỏ hàng
    const removeFromCart = async (itemId) => {
        setCartItems((prev) => {
            if (prev[itemId] > 1) {
                return { ...prev, [itemId]: prev[itemId] - 1 };
            } else {
                const updatedCart = { ...prev };
                delete updatedCart[itemId];
                return updatedCart;
            }
        });

        if (token) {
            try {
                await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } });
            } catch (error) {
                console.error("Error removing from cart:", error);
            }
        }
    };

    // ✅ Fetch danh sách món ăn
    const fetchFoodList = async () => {
        try {
            const response = await axios.get(url + "/api/food/list");
            setFoodList(response.data.data);
        } catch (error) {
            console.error("Error fetching food list:", error);
        }
    };

    // ✅ Fetch danh sách sản phẩm
    const fetchProductList = async () => {
        try {
            const response = await axios.get(url + "/api/product/list");
            setProductList(response.data.data);
        } catch (error) {
            console.error("Error fetching product list:", error);
        }
    };

    // ✅ Load giỏ hàng từ server
    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            if (response.data && response.data.cartData) {
                setCartItems(response.data.cartData);
            }
        } catch (error) {
            console.error("Error fetching cart data: ", error);
        }
    };

    // ✅ Cập nhật `cartAmount` và `deliveryFee` khi `cartItems` thay đổi
    useEffect(() => {
        const newCartAmount = getCartAmount();
        setCartAmount(newCartAmount);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        if (newCartAmount > 0 && newCartAmount < 100000) {
            setDeliveryFee(15000);
        } else if (newCartAmount >= 100000 && newCartAmount < 500000) {
            setDeliveryFee(10000);
        } else {
            setDeliveryFee(0);
        }
    }, [cartItems]); // Chỉ lắng nghe `cartItems`

    // ✅ Load dữ liệu từ API và localStorage khi component mount
    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            await fetchProductList();

            const tokenFromStorage = localStorage.getItem("token");
            if (tokenFromStorage) {
                setToken(tokenFromStorage);
                await loadCartData(tokenFromStorage);
            }

            const storedCartItems = localStorage.getItem("cartItems");
            if (storedCartItems) {
                try {
                    const parsedCart = JSON.parse(storedCartItems);
                    if (parsedCart && typeof parsedCart === "object") {
                        setCartItems(parsedCart);
                    }
                } catch (error) {
                    console.error("Invalid cartItems data in localStorage:", error);
                    localStorage.removeItem("cartItems"); // Xóa dữ liệu lỗi
                }
            }
        }
        loadData();
    }, []);

    // ✅ Giá trị context
    const contextValue = {
        foodList,
        productList,
        cartItems,
        deliveryFee,
        setCartItems,
        addToCart,
        removeFromCart,
        cartAmount,
        url,
        token,
        setToken,
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;
