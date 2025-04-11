import { createContext, useState, useMemo, useCallback } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null);

const StoreContextProvider = (props) => {
    const [cartItems, setCartItems] = useState({});
    const url = "http://localhost:5000";
    const [token, setToken] = useState("");

    // 优化商品查找
    const foodMap = useMemo(() => {
        return food_list.reduce((acc, item) => {
            acc[item._id] = item;
            return acc;
        }, {});
    }, []);

    // 优化添加商品函数
    const addToCart = useCallback((itemId) => {
        if (!foodMap[itemId]) {
            console.warn(`Product with id ${itemId} not found`);
            return;
        }
        setCartItems(prev => ({
            ...prev,
            [itemId]: (prev[itemId] || 0) + 1
        }));
    }, [foodMap]);

    // 优化移除商品函数
    const removeFromCart = useCallback((itemId) => {
        setCartItems(prev => {
            if (!prev[itemId]) return prev;
            
            if (prev[itemId] === 1) {
                const newItems = { ...prev };
                delete newItems[itemId];
                return newItems;
            }
            
            return {
                ...prev,
                [itemId]: prev[itemId] - 1
            };
        });
    }, []);

    // 修正：将 getTotalCartAmount 改回函数形式，但在内部使用 useMemo 缓存的 foodMap
    const getTotalCartAmount = () => {
        return Object.entries(cartItems).reduce((total, [itemId, quantity]) => {
            const item = foodMap[itemId];
            if (quantity > 0 && item) {
                return total + item.price * quantity;
            }
            return total;
        }, 0);
    };

    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        url,
        token,
        setToken
    };

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    );
};

export default StoreContextProvider;