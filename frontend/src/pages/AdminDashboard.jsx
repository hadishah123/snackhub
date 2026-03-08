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

  return (
    <div className="max-w-md mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">
        Orders
      </h1>

      {orders.map(order => (

        <div
          key={order._id}
          className="border rounded-lg p-4 mb-4"
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
            Status: {order.orderStatus}
          </p>

          <div className="flex gap-2 mt-3 flex-wrap">

            <button
              onClick={() => updateStatus(order._id, "confirmed")}
              className="bg-blue-500 text-white px-2 py-1 rounded"
            >
              Confirm
            </button>

            <button
              onClick={() => updateStatus(order._id, "preparing")}
              className="bg-yellow-500 text-white px-2 py-1 rounded"
            >
              Preparing
            </button>

            <button
              onClick={() => updateStatus(order._id, "out_for_delivery")}
              className="bg-purple-500 text-white px-2 py-1 rounded"
            >
              Out
            </button>

            <button
              onClick={() => updateStatus(order._id, "delivered")}
              className="bg-green-500 text-white px-2 py-1 rounded"
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