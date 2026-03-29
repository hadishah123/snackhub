import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { FaWhatsapp } from "react-icons/fa";

function Cart() {
  // 🔹 Context
  const { cartItems, totalAmount, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // 🔹 Navigation
  const navigate = useNavigate();

  // 🔹 State
  const [distance, setDistance] = useState(null);

  // 🔹 Shop Location
  const SHOP_LOCATION = {
    lat: 21.1651504,
    lng: 79.0802654,
  };

  // 🔹 Distance Function (Haversine)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 🔹 Get User Location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { latitude, longitude };
        localStorage.setItem("userLocationCoords", JSON.stringify(coords));

        const dist = getDistance(SHOP_LOCATION.lat, SHOP_LOCATION.lng, latitude, longitude);
        setDistance(dist);
      },
      (error) => console.log("Location error:", error)
    );
  }, [SHOP_LOCATION.lat, SHOP_LOCATION.lng]);

  // 🔹 Place Order
  const placeOrder = async () => {
    if (!cartItems || cartItems.length === 0) return alert("Your cart is empty!");

    const coords = JSON.parse(localStorage.getItem("userLocationCoords"));
    if (!coords) return alert("Please allow location access to place order.");

    // const dist = getDistance(SHOP_LOCATION.lat, SHOP_LOCATION.lng, coords.latitude, coords.longitude);
    if (distance > 15) return alert("🚫 Delivery is only available within 15 KM.");

    try {
      await axios.post("/api/orders", {
        customerName: user?.displayName || "Guest",
        customerEmail: user?.email || "",
        customerPhone: user?.phoneNumber || "",
        items: cartItems.map((item) => ({ name: item.name, price: item.price, quantity: item.quantity })),
        totalAmount,
        paymentMethod: "COD",

        location: {
          lat: coords?.latitude,
          lng: coords?.longitude
        }
      });

      clearCart();
      navigate("/order-success");
    } catch (error) {
      console.error("Order failed:", error);
      alert("Something went wrong with your order.");
    }
  };

  // 🔹 WhatsApp Order
  const handleWhatsAppOrder = () => {
    if (!cartItems.length) return alert("Cart is empty!");

    const coords = JSON.parse(localStorage.getItem("userLocationCoords"));
    const message = `
    *New Order - SnackHub*

    Name: ${user?.displayName || "Guest"}
    Phone: ${user?.phoneNumber || "N/A"}

    Items:
    ${cartItems
      .map((item) => `- ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`)
      .join("\n")}

    Total: ₹${totalAmount}
    Payment: Cash on Delivery
    Location: ${
      coords
        ? `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
        : "Not shared"
    }`
    ;
    const encoded = encodeURIComponent(message);
    const phone = "919545267216";
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  const handleRazorpayPayment = async () => {
    if (!cartItems.length) return alert("Cart is empty!");

    const coords = JSON.parse(localStorage.getItem("userLocationCoords"));
    if (!coords) return alert("Please allow location access");

    if (distance > 15) return alert("🚫 Delivery only within 15 KM");

    try {
      // 1️⃣ Create Razorpay order from backend
      const { data } = await axios.post("/api/payment/create-order", {
        amount: totalAmount,
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // frontend key
        amount: data.amount,
        currency: data.currency,
        name: "SnackHub",
        description: "Food Order Payment",
        order_id: data.id,

        handler: async function () {
          // 2️⃣ On successful payment → save order
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
            paymentMethod: "Razorpay",

            location: {
              lat: coords.latitude,
              lng: coords.longitude
            }
          });

          clearCart();
          navigate("/order-success");
        },

        prefill: {
          name: user?.displayName || "",
          email: user?.email || "",
          contact: user?.phoneNumber || "",
        },

        theme: {
          color: "#16a34a", // green theme
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Razorpay error:", error);
      alert("Payment failed. Try again.");
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50">
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
            {/* Cart Items */}
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

            {/* Total Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-xl font-medium text-gray-600">Total Amount:</span>
                <span className="text-3xl font-black text-green-600">₹{totalAmount}</span>
              </div>

              {distance && (
                <p className="text-sm text-gray-500 mt-2">
                  📍 Delivery distance: <strong>{distance.toFixed(2)} km</strong>
                </p>
              )}

              {distance !== null && distance > 15 && (
                <p className="text-red-500 text-sm mt-2">
                  🚫 Delivery only within 15 km
                </p>
              )}

              <div className="flex flex-col gap-3 mt-6">
                <p className="text-sm text-gray-500 mt-4">Choose payment method</p>

                {/* Reusable disabled logic */}
                {(() => {
                  const isDisabled = !cartItems.length || (distance !== null && distance > 15); 
                  const disabledText = distance !== null && distance > 15 ? "Out of delivery range" : "";

                  return (
                    <>
                      {/* COD Button */}
                      <button
                        onClick={placeOrder}
                        disabled={isDisabled}
                        className={`w-full py-4 rounded-xl text-lg font-bold ${
                          isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 text-white"
                        }`}
                      >
                        {disabledText || "Cash on Delivery"}
                      </button>

                      {/* Razorpay Button */}
                      <button
                        onClick={handleRazorpayPayment}
                        disabled={isDisabled}
                        className={`w-full py-4 rounded-xl text-lg font-bold ${
                          isDisabled ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-900 text-white"
                        }`}
                      >
                        {disabledText || "Pay Online"}
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>
          </>
        )}
      </div>

      {/* ✅ WhatsApp Floating Button - Outside Main Container */}
      {cartItems && cartItems.length > 0 && (
        <button
          onClick={handleWhatsAppOrder}
          className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-3 rounded-full shadow-lg z-50 transition-all"
        >
          {/* Mobile text */}
          <span className="sm:hidden font-semibold">Order on</span>

          {/* Icon */}
          <FaWhatsapp className="text-xl" />

          {/* Desktop text */}
          <span className="hidden sm:inline font-semibold">WhatsApp</span>
        </button>
      )}
    </div>
  );
}

export default Cart;