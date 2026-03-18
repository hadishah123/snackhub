import { useEffect, useState } from "react";
import axios from "../api/axios";
import { getAuth } from "firebase/auth";

// 🔥 Import socket client
import socket from "../socket";

function Orders() {
  const [orders, setOrders] = useState([]);

  const auth = getAuth();
  const user = auth.currentUser;
  console.log("Logged user:", user?.email);

  // Fetch orders initially
  useEffect(() => {
    const fetchOrders = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      try {
        const res = await axios.get(`/api/orders/user/${user.email}`);
        console.log("Orders:", res.data);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // 🔥 Listen for real-time order updates
  useEffect(() => {
    // Listen for 'orderUpdated' events
    socket.on("orderUpdated", (updatedOrder) => {
      console.log("Order updated:", updatedOrder);
      // Only update orders that belong to the current user
      setOrders((prev) =>
        prev.map((order) =>
          order._id === updatedOrder._id ? updatedOrder : order
        )
      );
    });

    // Cleanup listener on unmount
    return () => {
      socket.off("orderUpdated");
    };
  }, []);

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          className="border p-4 rounded-lg mb-4"
        >
          <p className="font-semibold">Order ID: {order._id.slice(-6)}</p>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleString()}
          </p>

          <div className="mt-2">
            {order.items.map((item, i) => (
              <p key={i}>
                {item.name} x {item.quantity}
              </p>
            ))}
          </div>

          <p className="mt-2 font-bold">₹{order.totalAmount}</p>
          <p className="text-sm mt-1">Status: {order.orderStatus}</p>
        </div>
      ))}
    </div>
  );
}

export default Orders;