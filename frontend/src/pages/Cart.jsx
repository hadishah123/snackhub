import { LocationContext } from "../context/LocationContext";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { FaWhatsapp, FaTrash } from "react-icons/fa";
import WhatsAppButton from "../components/WhatsAppButton";

function Cart() {
  const [phoneInput, setPhoneInput] = useState("");
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [paymentType, setPaymentType] = useState(null);
  // 🔹 Context
  const {
    cartItems,
    totalAmount,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useContext(CartContext);
  const { locationEnabled, location, requestLocation } =
    useContext(LocationContext);
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

  // 🔹 New COD Button Handler
  const handleCODClick = async (phone) => {
    if (!cartItems.length) return alert("Your cart is empty!");

    let coords = location;
    if (!locationEnabled) {
      coords = await requestLocation(); // prompt user and wait
      if (!coords) return; // user denied
    }

    // Calculate distance
    const dist = getDistance(
      SHOP_LOCATION.lat,
      SHOP_LOCATION.lng,
      coords.lat,
      coords.lng,
    );
    if (dist > 15) return alert("🚫 Delivery is only available within 15 KM.");

    placeOrder(coords, phone); // pass the coords directly
  };

  // 🔹 Get User Location
  useEffect(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const coords = { latitude, longitude };
        localStorage.setItem("userLocationCoords", JSON.stringify(coords));

        const dist = getDistance(
          SHOP_LOCATION.lat,
          SHOP_LOCATION.lng,
          latitude,
          longitude,
        );
        setDistance(dist);
      },
      (error) => console.log("Location error:", error),
    );
  }, [SHOP_LOCATION.lat, SHOP_LOCATION.lng]);

  // 🔹 Place Order
  const placeOrder = async (coordsParam, phone) => {
    const coords =
      coordsParam || JSON.parse(localStorage.getItem("userLocationCoords"));
    if (!coords) return alert("Please allow location access to place order.");

    if (distance !== null && distance > 15)
      return alert("🚫 Delivery is only available within 15 KM.");

    try {
      await axios.post("/api/orders", {
        customerName: user?.displayName || "Guest",
        customerEmail: user?.email || "",
        customerPhone: phone,
        items: cartItems.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount,
        paymentMethod: "COD",
        location: {
          lat: coords.lat || coords.latitude,
          lng: coords.lng || coords.longitude,
        },
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
      .map(
        (item) =>
          `- ${item.name} x ${item.quantity} = ₹${item.price * item.quantity}`,
      )
      .join("\n")}

    Total: ₹${totalAmount}
    Payment: Cash on Delivery
    Location: ${
      coords
        ? `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`
        : "Not shared"
    }`;
    const encoded = encodeURIComponent(message);
    const phone = "919545267216";
    window.open(`https://wa.me/${phone}?text=${encoded}`, "_blank");
  };

  const handleRazorpayPayment = async (phone) => {
    if (!cartItems.length) return alert("Cart is empty!");

    const coords = JSON.parse(localStorage.getItem("userLocationCoords"));
    if (!coords) return alert("Please allow location access");

    if (distance !== null && distance > 15)
      return alert("🚫 Delivery only within 15 KM");

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
            customerPhone: phone,
            items: cartItems.map((item) => ({
              name: item.name,
              price: item.price,
              quantity: item.quantity,
            })),
            totalAmount,
            paymentMethod: "Razorpay",

            location: {
              lat: coords.latitude,
              lng: coords.longitude,
            },
          });

          clearCart();
          navigate("/order-success");
        },

        prefill: {
          name: user?.displayName || "",
          email: user?.email || "",
          contact: phone,
        },

        theme: {
          color: "#16a34a",
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
    <>
      <div className="min-h bg-[#0f0f0f] text-white flex justify-center px-3 py-6">
        {/* MAIN CARD */}
        <div className="w-full max-w-md bg-[#1a1a1a] border border-gray-800 rounded-2xl shadow-xl overflow-hidden flex flex-col">
          {/* HEADER */}
          <div className="p-4 border-b border-gray-800">
            <h2 className="text-lg font-bold text-center text-yellow-400">
              Your Cart
            </h2>
          </div>

          {/* EMPTY STATE */}
          {!cartItems || cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <p className="text-gray-400 text-sm">Your cart is empty 🍿</p>

              <button
                onClick={() => navigate("/menu")}
                className="mt-4 bg-green-500 text-black font-bold px-5 py-2 rounded-full active:scale-95"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              {/* ITEMS */}
              <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex justify-between items-center bg-[#0f0f0f] border border-gray-800 rounded-xl p-3"
                  >
                    {/* LEFT */}
                    <div className="flex-1 pr-3">
                      <h3 className="text-sm font-semibold">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">
                        ₹{item.price}
                      </p>

                      {/* QUANTITY CONTROLLER */}
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => decreaseQuantity(item._id)}
                          className="w-7 h-7 flex items-center justify-center bg-gray-800 text-white rounded-md active:scale-95"
                        >
                          -
                        </button>

                        <span className="text-sm font-semibold min-w-5 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item._id)}
                          className="w-7 h-7 flex items-center justify-center bg-yellow-400 text-black rounded-md active:scale-95"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right">
                      <p className="text-white font-semibold text-sm">
                        ₹{item.price * item.quantity}
                      </p>

                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="mt-2 p-2 rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 active:scale-95 transition"
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* FOOTER / CHECKOUT */}
              <div className="border-t border-gray-800 p-4 bg-[#111]">
                {/* TOTAL */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 text-sm">Total</span>
                  <span className="text-2xl font-black text-green-400 drop-shadow-[0_0_6px_rgba(34,197,94,0.4)]">
                    ₹{totalAmount}
                  </span>
                </div>

                {/* DISTANCE WARN */}
                {distance && (
                  <p className="text-xs text-gray-400 mb-2">
                    📍 {distance.toFixed(2)} km away
                  </p>
                )}

                {distance !== null && distance > 15 && (
                  <p className="text-xs text-red-400 mb-2">
                    🚫 Outside delivery range
                  </p>
                )}

                {/* BUTTONS */}
                <div className="space-y-2 mb-5">
                  <button
                    onClick={() => {
                      setPaymentType("COD");
                      setShowPhoneModal(true);
                    }}
                    className="w-full py-3 rounded-xl font-bold bg-green-500 text-black active:scale-95"
                  >
                    Cash on Delivery
                  </button>

                  <button
                    onClick={() => {
                      setPaymentType("RAZORPAY");
                      setShowPhoneModal(true);
                    }}
                    className="w-full py-3 rounded-xl font-bold bg-yellow-400 text-black active:scale-95"
                  >
                    Pay Online
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* WHATSAPP FLOAT */}
        {cartItems && cartItems.length > 0 && (
          <button
            onClick={handleWhatsAppOrder}
            className="fixed bottom-16 right-4 bg-[#25D366] text-black px-4 py-3 rounded-full shadow-lg flex items-center gap-2 active:scale-95"
          >
            <span className="text-sm font-semibold">Order on</span>
            <FaWhatsapp />
          </button>
        )}

        {/* PHONE MODAL */}
        {showPhoneModal && (
          <div className="fixed inset-0 bg-black/70 flex items-end justify-center z-50">
            <div className="bg-[#1a1a1a] w-full max-w-md p-5 rounded-t-2xl border border-gray-800">
              <h2 className="text-lg font-bold mb-3 text-yellow-400">
                Enter Phone Number
              </h2>

              <input
                type="tel"
                placeholder="10-digit number"
                value={phoneInput}
                onChange={(e) =>
                  setPhoneInput(e.target.value.replace(/\D/g, ""))
                }
                maxLength={10}
                className="w-full bg-[#0f0f0f] border border-gray-700 text-white p-3 rounded mb-3"
              />

              <button
                onClick={async () => {
                  if (phoneInput.length !== 10) {
                    alert("Enter valid phone number");
                    return;
                  }

                  setShowPhoneModal(false);

                  if (paymentType === "COD") {
                    handleCODClick(phoneInput);
                  } else {
                    handleRazorpayPayment(phoneInput);
                  }
                }}
                className="w-full bg-green-500 text-black py-3 rounded-lg font-bold"
              >
                Continue
              </button>

              <button
                onClick={() => setShowPhoneModal(false)}
                className="w-full mt-2 text-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
