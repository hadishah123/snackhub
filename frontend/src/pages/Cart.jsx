import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Cart() {
  const { cart, dispatch } = useContext(CartContext);

  // Calculate total price
  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return <p>Your cart is empty 🛒</p>;
  }

  return (
    <div>
      <h2>Your Cart</h2>

      {cart.map((item) => (
        <div key={item._id} style={{ borderBottom: "1px solid #ccc", marginBottom: "10px", paddingBottom: "10px" }}>
          <h3>{item.name}</h3>
          <p>Price: ₹{item.price}</p>
          <p>Qty: {item.quantity}</p>

          <button
            onClick={() =>
              dispatch({ type: "INCREASE_QTY", payload: item._id })
            }
          >
            +
          </button>

          <button
            onClick={() =>
              dispatch({ type: "DECREASE_QTY", payload: item._id })
            }
            disabled={item.quantity <= 1} // Prevent quantity < 1
          >
            -
          </button>

          <button
            onClick={() =>
              dispatch({ type: "REMOVE_FROM_CART", payload: item._id })
            }
          >
            Remove
          </button>
        </div>
      ))}

      <h3>Total: ₹{total}</h3>
    </div>
  );
}

export default Cart;