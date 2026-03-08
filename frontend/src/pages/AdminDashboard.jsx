import { useEffect, useState } from "react";
import axios from "../api/axios";

function AdminDashboard() {
  const [orders, setOrders] = useState([]);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user?.email) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get("/api/orders", {
          headers: {
            "user-email": user.email
          }
        });

        setOrders(res.data);

      } catch (error) {
        console.error("Error fetching orders", error);
      }
    };

    fetchOrders();

  }, [user?.email]);

  const updateStatus = async (id, status) => {
    try {

      await axios.put(
        `/api/orders/${id}/status`,
        { orderStatus: status },
        {
          headers: { "user-email": user.email }
        }
      );

      setOrders(prev =>
        prev.map(order =>
          order._id === id
            ? { ...order, orderStatus: status }
            : order
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