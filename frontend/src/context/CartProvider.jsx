import { useReducer, useEffect, useMemo } from "react";
import { CartContext } from "./CartContext";

const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const existingItem = state.find((item) => item._id === action.payload._id);
      if (existingItem) {
        return state.map((item) =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.payload, quantity: 1 }];
    }

    case "REMOVE_FROM_CART":
      return state.filter((item) => item._id !== action.payload);

    case "INCREASE_QTY":
      return state.map((item) =>
        item._id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
      );

    case "DECREASE_QTY":
      return state
        .map((item) =>
          item._id === action.payload ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(
    cartReducer,
    [],
    () => {
      const localData = localStorage.getItem("cart");
      return localData ? JSON.parse(localData) : [];
    }
  );

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Calculate total price automatically
  const totalAmount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  // Helper functions to match your Cart.jsx requirements
  const removeFromCart = (id) => dispatch({ type: "REMOVE_FROM_CART", payload: id });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider
      value={{
        cartItems: cart, // Renamed to match your component
        totalAmount,
        removeFromCart,
        clearCart,
        dispatch,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}