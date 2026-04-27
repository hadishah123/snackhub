import { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
// import { getAuth } from "firebase/auth";
import WhatsAppButton from "../components/WhatsAppButton";
import socket from "../socket";
import CallButton from "../components/CallButton";
import OrderProgress from "../components/OrderProgress";
import OrderSkeleton from "../components/OrderSkeleton";
import EmptyState from "../components/EmptyState";
import AdminOrdersButton from "../components/AdminOrdersButton";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeNow, setTimeNow] = useState(new Date());
  const { user } = useContext(AuthContext);

  const isAdmin = user?.email === "admin@snackhub.com";

  const formatOrderDate = (date) => {
    const now = new Date();
    const orderDate = new Date(date);

    const isToday = orderDate.toDateString() === now.toDateString();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = orderDate.toDateString() === yesterday.toDateString();

    const diffDays = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

    const time = orderDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (isToday) return `Today, ${time}`;
    if (isYesterday) return `Yesterday, ${time}`;

    if (diffDays < 7) {
      return `${orderDate.toLocaleDateString([], {
        weekday: "short",
      })}, ${time}`;
    }

    return `${orderDate.toLocaleDateString([], {
      day: "numeric",
      month: "short",
      year: "numeric",
    })}, ${time}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(new Date());
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  // Fetch orders initially
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const res = await axios.get(`/api/orders/user/${user.email}`);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const cancelOrder = async (id) => {
    try {
      const res = await axios.put(`/api/orders/cancel/${id}`);

      // Update local state
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, orderStatus: "cancelled" } : o,
        ),
      );

      // 🔥 Emit socket event so admins know
      socket.emit("orderUpdated", res.data); // assuming res.data is updated order
    } catch (err) {
      console.error("Cancel error:", err);
      console.error("Response:", err.response);
      alert(err.response?.data?.message || err.message || "Cancel failed");
    }
  };

  // 🔥 Listen for real-time order updates
  useEffect(() => {
    // Listen for 'orderUpdated' events
    socket.on("orderUpdated", (updatedOrder) => {
      console.log("Order updated:", updatedOrder);
      // Only update orders that belong to the current user
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        ),
      );
    });
    // Cleanup listener on unmount
    return () => {
      socket.off("orderUpdated");
    };
  }, []);

  return (
    <>
      <WhatsAppButton />
      <CallButton />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-md mx-auto px-4 py-6 pb-28 bg-[#0f0f0f] min-h-screen text-white"
      >
        {/* Header */}
        <h1 className="text-xl font-bold text-yellow-400 mb-5 text-center">
          Your Orders
        </h1>

        {!user ? (
          <EmptyState
            title="Please login first 🔐"
            description="Sign in to view your order history"
          />
        ) : loading ? (
          [...Array(3)].map((_, i) => <OrderSkeleton key={i} />)
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet 🧾"
            description="You haven't placed any orders yet. Start exploring the menu!"
          />
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order) => (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.35 }}
                  className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 shadow-lg"
                >
                  {/* Top row */}
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-yellow-400">
                      #{order._id.toUpperCase().slice(-6)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatOrderDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Items */}
                  <div className="mt-3 space-y-1 text-sm text-gray-300">
                    {order.items.map((item, i) => (
                      <p key={i}>
                        {item.name} × {item.quantity}
                      </p>
                    ))}
                  </div>

                  {/* Bottom info */}
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-lg font-bold text-green-400">
                      ₹{order.totalAmount}
                    </p>

                    <span className="text-xs px-2 py-1 rounded-full bg-gray-800 text-gray-300">
                      {order.paymentMethod}
                    </span>
                  </div>

                  <p className="text-xs mt-2 text-gray-400">
                    Status:{" "}
                    <motion.span
                      key={order.orderStatus}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-yellow-400 font-medium"
                    >
                      {order.orderStatus}
                    </motion.span>
                  </p>

                  <OrderProgress status={order.orderStatus} />

                  {/* Cancel / Call section */}
                  {(() => {
                    const elapsed = timeNow - new Date(order.createdAt);
                    const remaining = 5 * 60 * 1000 - elapsed;

                    const canCancel =
                      remaining > 0 && order.orderStatus === "pending";

                    const minutes = Math.floor(remaining / 60000);
                    const seconds = Math.floor((remaining % 60000) / 1000);

                    return canCancel ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => cancelOrder(order._id)}
                          className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-semibold transition-all"
                        >
                          Cancel Order
                        </motion.button>

                        <motion.p
                          animate={{ opacity: [1, 0.6, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="text-xs text-red-400 mt-2 text-center"
                        >
                          ⚠️ Cancel in {minutes}:
                          {String(seconds).padStart(2, "0")} — call for faster
                          help
                        </motion.p>
                      </>
                    ) : (
                      <p
                        className="text-xs text-gray-500 mt-3 text-center hover:text-gray-300 cursor-pointer"
                        onClick={() =>
                          (window.location.href = "tel:918999212149")
                        }
                      >
                        Call the owner for faster service
                      </p>
                    );
                  })()}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {isAdmin && <AdminOrdersButton />}
      </motion.div>
    </>
  );
}

export default Orders;
