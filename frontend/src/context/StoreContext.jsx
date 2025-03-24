import { createContext, useEffect, useState } from "react";
import axios from 'axios'
export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems, setCartItems] = useState({});
    const [cartAmount, setCartAmount] = useState(0)
    const [deliveryFee, setDeliveryFee] = useState(0);
    const url = import.meta.env.VITE_API_URL;
    const [token, setToken] = useState("")
    const [foodList, setFoodList] = useState([[]]);
    const [productList, setProductList] = useState([[]])

    const addToCart = async (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev) => ({ ...prev, [itemId]: 1 }))
        }
        else {
            setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }))
        }
        if (token) {
            await axios.post(url + "/api/cart/add", { itemId }, { headers: { token } })
        }

    }

    const removeFromCart = async (itemId) => {
        setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }))
        if (token) {
            await axios.post(url + "/api/cart/remove", { itemId }, { headers: { token } })
        }
    }

    const getCartAmount = () => {
        let totalAmount = 0
        for (const item in cartItems) {
            if (cartItems[item] > 0) {
                let itemInfo = productList.find((product) => product._id === item)
                totalAmount += itemInfo.price * cartItems[item]
            }
        }
        return totalAmount;

    }

    const fetchFoodList = async () => {
        const response = await axios.get(url + "/api/food/list")
        setFoodList(response.data.data)
    }

    const fetchProductList = async () => {
        const response = await axios.get(url + "/api/product/list")
        setProductList(response.data.data)
    }

    const loadCartData = async (token) => {
        try {
            const response = await axios.post(url + "/api/cart/get", {}, { headers: { token } });
            if (response.data && response.data.cartData) {
                setCartItems(response.data.cartData); // Kiểm tra nếu cartData tồn tại
            } else {
                console.error("No cart data found in response.");
            }
        } catch (error) {
            console.error("Error fetching cart data: ", error);
        }
    };
    useEffect(() => {
        if (Object.keys(cartItems).length) {
            setCartAmount(getCartAmount());
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            if (cartAmount > 0 && cartAmount < 100000) setDeliveryFee(15000)
            else if (cartAmount > 0 && cartAmount < 500000) setDeliveryFee(10000)
        }
    }, [cartAmount, cartItems])

    useEffect(() => {
        async function loadData() {
            await fetchFoodList();
            await fetchProductList();
            if (localStorage.getItem("token")) {
                setToken(localStorage.getItem("token"))
                await loadCartData(localStorage.getItem("token"))
            }
            if (localStorage.getItem("cartItems")) {
                setCartItems(JSON.parse(localStorage.getItem("cartItems")))
            }
        }
        loadData();
    }, [])

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
        setToken
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )
}

export default StoreContextProvider
