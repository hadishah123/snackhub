import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";

function Cart() {
  const { cartItems, totalAmount, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const placeOrder = async () => {
    if (!cartItems || cartItems.length === 0) return alert("Your cart is empty!");

    try {
      await axios.post("/api/orders", {
        customerName: user?.displayName || "Guest",
        customerEmail: user?.email || "",
        customerPhone: user?.phoneNumber || "",
        items: cartItems.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        totalAmount,
        paymentMethod: "COD",
      });

      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.error("Order failed:", error);
      alert("Something went wrong with your order.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Your Cart</h2>

      {!cartItems || cartItems.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-lg">Your cart is empty. Time to buy some snacks! 🍿</p>
          <button 
            onClick={() => navigate("/menu")}
            className="mt-4 text-green-600 font-semibold underline"
          >
            Go to Menu
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex justify-between items-center border-b pb-4">
                <div>
                  <h3 className="font-bold text-gray-700">{item.name}</h3>
                  <p className="text-sm text-gray-500">
                    ₹{item.price} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <p className="font-bold text-lg">₹{item.price * item.quantity}</p>
                  <button 
                    onClick={() => removeFromCart(item._id)}
                    className="bg-red-50 text-red-500 px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition-all text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <span className="text-xl font-medium text-gray-600">Total Amount:</span>
              <span className="text-3xl font-black text-green-600">₹{totalAmount}</span>
            </div>

            <button
              onClick={placeOrder}
              className="w-full bg-green-600 hover:bg-green-700 text-white text-xl font-bold py-4 mt-6 rounded-xl shadow-lg transform transition hover:scale-[1.02] active:scale-95"
            >
              Place Order (Cash on Delivery)
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;