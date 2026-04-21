import { useEffect, useState } from "react";
import axios from "../api/axios";

// 🔥 Import socket client
import socket from "../socket";
import WhatsAppButton from "../components/WhatsAppButton";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

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

  // Fetch all orders on mount
  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders", {
          headers: { "user-email": user.email },
        });

        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();
  }, [user?.email]);

  // 🔥 Socket.IO listeners for real-time updates
  useEffect(() => {
    // New orders from customers
    socket.on("newOrder", (order) => {
      console.log("New order received:", order);
      setOrders((prev) => [order, ...prev]);
    });

    // Order status updates (for multiple admins)
    socket.on("orderUpdated", (updatedOrder) => {
      console.log("Order updated:", updatedOrder);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order,
        ),
      );
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off("newOrder");
      socket.off("orderUpdated");
    };
  }, []);

  // Update order status via API
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `/api/orders/${id}/status`,
        { orderStatus: status },
        { headers: { "user-email": user.email } },
      );

      // Optimistically update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, orderStatus: status } : order,
        ),
      );
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  const adminCancel = async (id) => {
    try {
      await axios.put(
        `/api/orders/admin/cancel/${id}`,
        {},
        {
          headers: { "user-email": user.email },
        },
      );

      setOrders((prev) =>
        prev.map((o) =>
          o._id === id ? { ...o, orderStatus: "cancelled" } : o,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <WhatsAppButton />
      <div className="max-w-md mx-auto px-4 py-6 bg-[#0f0f0f] min-h-screen text-white">
        <h1 className="text-xl font-bold text-yellow-400 mb-5 text-center">
          Orders
        </h1>

        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 mb-4 shadow-lg"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <p className="font-semibold text-yellow-400">
                #{order._id.slice(-6)}
              </p>
              <p className="text-xs text-gray-500">
                {formatOrderDate(order.createdAt)}
              </p>
            </div>

            {/* Customer */}
            {/* CUSTOMER INFO PANEL */}
            <div className="mt-2 p-3 rounded-xl bg-[#0f0f0f] border border-gray-700 space-y-2">
              {/* Name */}
              <p className="text-sm font-semibold text-white">
                👤 {order.customerName}
              </p>

              {/* Phone - HIGH VISIBILITY */}
              {order.customerPhone && (
                <a
                  href={`tel:${order.customerPhone}`}
                  className="flex items-center justify-between px-2 py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 font-semibold text-xs hover:bg-green-500/20"
                >
                  <span>📞 Call Customer</span>
                  <span>{order.customerPhone}</span>
                </a>
              )}

              {/* Location - HIGH VISIBILITY */}
              {order.location?.lat && order.location?.lng && (
                <a
                  href={`https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between px-2 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 font-semibold text-xs hover:bg-blue-500/20"
                >
                  <span>📍 Open Location</span>
                  <span className="underline">Map</span>
                </a>
              )}
            </div>

            {/* Items */}
            <div className="mt-3 space-y-1 text-sm text-gray-300">
              {order.items.map((item, i) => (
                <p key={i}>
                  {item.name} × {item.quantity}
                </p>
              ))}
            </div>

            {/* Price */}
            <p className="font-bold text-lg text-green-400 mt-3">
              ₹{order.totalAmount}
            </p>

            {/* Payment */}
            <p className="text-xs text-gray-400 mt-1">
              Payment:{" "}
              <span
                className={`ml-1 px-2 py-1 rounded-full text-xs font-semibold ${
                  order.paymentMethod === "COD"
                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                    : order.paymentMethod === "RAZORPAY"
                      ? "bg-yellow-400/20 text-yellow-300 border border-yellow-400/30"
                      : "bg-gray-700 text-gray-300"
                }`}
              >
                {order.paymentMethod || "N/A"}
              </span>
            </p>

            {/* Distance */}
            <p className="text-xs text-gray-500 mt-1">
              {order.distance != null
                ? `${order.distance.toFixed(2)} km away`
                : ""}
            </p>

            {/* Status */}
            <span
  className={`px-2 py-1 rounded-full text-xs font-semibold border ${
    order.orderStatus === "pending"
      ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/30"
      : order.orderStatus === "confirmed"
      ? "bg-blue-500/10 text-blue-400 border-blue-500/30"
      : order.orderStatus === "preparing"
      ? "bg-orange-500/10 text-orange-400 border-orange-500/30"
      : order.orderStatus === "out_for_delivery"
      ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
      : order.orderStatus === "delivered"
      ? "bg-green-500/10 text-green-400 border-green-500/30"
      : "bg-red-500/10 text-red-400 border-red-500/30"
  }`}
>
  {order.orderStatus}
</span>

            {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-4">

  {/* Confirm */}
  <button
    onClick={() => updateStatus(order._id, "confirmed")}
    className={`py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
      order.orderStatus === "confirmed"
        ? "bg-blue-500 text-white ring-2 ring-blue-300 shadow-lg shadow-blue-500/30 scale-102"
        : "bg-blue-500/20 text-blue-300 hover:bg-blue-500 hover:text-white opacity-60"
    }`}
  >
    Confirm
  </button>

  {/* Preparing */}
  <button
    onClick={() => updateStatus(order._id, "preparing")}
    className={`py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
      order.orderStatus === "preparing"
        ? "bg-yellow-500 text-black ring-2 ring-yellow-300 shadow-lg shadow-yellow-500/30 scale-102"
        : "bg-yellow-500/20 text-yellow-300 hover:bg-yellow-500 hover:text-black opacity-60"
    }`}
  >
    Preparing
  </button>

  {/* Out for Delivery */}
  <button
    onClick={() => updateStatus(order._id, "out_for_delivery")}
    className={`py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
      order.orderStatus === "out_for_delivery"
        ? "bg-purple-500 text-white ring-2 ring-purple-300 shadow-lg shadow-purple-500/30 scale-102"
        : "bg-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white opacity-60"
    }`}
  >
    Out
  </button>

  {/* Delivered */}
  <button
    onClick={() => updateStatus(order._id, "delivered")}
    className={`py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
      order.orderStatus === "delivered"
        ? "bg-green-500 text-black ring-2 ring-green-300 shadow-lg shadow-green-500/30 scale-102"
        : "bg-green-500/20 text-green-300 hover:bg-green-500 hover:text-black opacity-60"
    }`}
  >
    Delivered
  </button>

  {/* Cancel */}
  <button
    onClick={() => {
      adminCancel(order._id);
      updateStatus(order._id, "cancelled");
    }}
    className={`col-span-2 py-2 rounded-lg text-sm font-semibold transition-all active:scale-95 ${
      order.orderStatus === "cancelled"
        ? "bg-red-500 text-white ring-2 ring-red-300 shadow-lg shadow-red-500/30 scale-102"
        : "bg-red-500/20 text-red-300 hover:bg-red-500 hover:text-white opacity-60"
    }`}
  >
    Cancel Order
  </button>

</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default AdminDashboard;
