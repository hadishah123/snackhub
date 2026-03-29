import { useEffect, useState } from "react"; 
import axios from "../api/axios";

// 🔥 Import socket client
import socket from "../socket";
  
function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Fetch all orders on mount
  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders", {
          headers: { "user-email": user.email }
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
      setOrders(prev => [order, ...prev]);
    });

    // Order status updates (for multiple admins)
    socket.on("orderUpdated", (updatedOrder) => {
      console.log("Order updated:", updatedOrder);
      setOrders(prev =>
        prev.map(order =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
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
        { headers: { "user-email": user.email } }
      );

      // Optimistically update local state
      setOrders(prev =>
        prev.map(order =>
          order._id === id ? { ...order, orderStatus: status } : order
        )
      );
    } catch (error) {
      console.error("Error updating status", error);
    }
  };

  // Helper function for button styles
  const getButtonClass = (currentStatus, buttonStatus, activeColor) => {
    if (currentStatus === buttonStatus) {
      return `${activeColor} text-white px-3 py-1 rounded border-2 border-black transition-all duration-200`;
    }

    return "bg-gray-200 text-gray-700 px-3 py-1 rounded opacity-70 hover:opacity-100 transition-all duration-200";
  };

  return (
    <div className="max-w-md mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">
        Orders
      </h1>

      {orders.map(order => (

        <div
          key={order._id}
          className="border rounded-lg p-4 mb-4 shadow-sm"
        >

          <p className="font-semibold">
            Order #{order._id.slice(-6)}
          </p>

          <p className="text-sm text-gray-500">
            {order.customerName}
          </p>

          <p className="text-xs text-gray-400">
          {new Date(order.createdAt).toLocaleString()}
          </p>

          <div className="mt-2">
            {order.items.map((item, i) => (
              <p key={i}>
                {item.name} x {item.quantity}
              </p>
            ))}
          </div>

          <p className="font-bold mt-2">
            ₹{order.totalAmount}
          </p>

          {order.location?.lat != null && order.location?.lng != null && (
            <a
              href={`https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block bg-black text-white text-sm px-3 py-1 rounded"
            >
              📍 Open in Maps
            </a>
          )}

          <span className="text-sm text-gray-500">
            {order.distance != null
              ? `${order.distance.toFixed(2)} km away`
              : "Distance not available"}
          </span>
          <p className="text-sm mt-1">
            Status: <span className="font-medium">{order.orderStatus}</span>
          </p>

          <div className="grid grid-cols-2 gap-2 mt-3">

            <button
              disabled={order.orderStatus === "confirmed"}
              onClick={() => updateStatus(order._id, "confirmed")}
              className={getButtonClass(order.orderStatus, "confirmed", "bg-blue-500")}
            >
              Confirm
            </button>

            <button
              disabled={order.orderStatus === "preparing"}
              onClick={() => updateStatus(order._id, "preparing")}
              className={getButtonClass(order.orderStatus, "preparing", "bg-yellow-500")}
            >
              Preparing
            </button>

            <button
              disabled={order.orderStatus === "out_for_delivery"}
              onClick={() => updateStatus(order._id, "out_for_delivery")}
              className={getButtonClass(order.orderStatus, "out_for_delivery", "bg-purple-500")}
            >
              Out
            </button>

            <button
              disabled={order.orderStatus === "delivered"}
              onClick={() => updateStatus(order._id, "delivered")}
              className={getButtonClass(order.orderStatus, "delivered", "bg-green-500")}
            >
              Delivered
            </button>

          </div>

        </div>

      ))}

    </div>
  );
}

export default AdminDashboard;