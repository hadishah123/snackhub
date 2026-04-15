import { useEffect, useState } from "react";
import axios from "../api/axios";
import { getAuth } from "firebase/auth";
import WhatsAppButton from "../components/WhatsAppButton";
import socket from "../socket";
import CallButton from "../components/CallButton";
import OrderProgress from "../components/OrderProgress";
import OrderSkeleton from "../components/OrderSkeleton";
import EmptyState from "../components/EmptyState";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeNow, setTimeNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeNow(new Date());
    }, 1000); // update every second

    return () => clearInterval(interval);
  }, []);

  // Fetch orders initially
  useEffect(() => {
    const fetchOrders = async () => {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) return;

      try {
        const res = await axios.get(`/api/orders/user/${user.email}`);
        // console.log("Orders:", res.data);
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
      <div className="max-w-md mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
        {loading ? (
          [...Array(3)].map((_, i) => <OrderSkeleton key={i} />)
        ) : orders.length === 0 ? (
          <EmptyState
            title="No orders yet 🧾"
            description="Start ordering your favorite snacks!"
          />
        ) : (
          orders.map((order) => (
            <div key={order._id} className="border p-4 rounded-lg mb-4">
              <p className="font-semibold">
                Order ID: {order._id.toUpperCase().slice(-6)}
              </p>
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
              <p className="text-sm mt-1">Payment: {order.paymentMethod}</p>
              <p className="text-sm mt-1">Status: {order.orderStatus}</p>
              <OrderProgress status={order.orderStatus} />
              {(() => {
                const elapsed = timeNow - new Date(order.createdAt);
                const remaining = 5 * 60 * 1000 - elapsed;

                const canCancel =
                  remaining > 0 && order.orderStatus === "pending";

                const minutes = Math.floor(remaining / 60000);
                const seconds = Math.floor((remaining % 60000) / 1000);

                return canCancel ? (
                  <>
                    <button
                      onClick={() => cancelOrder(order._id)}
                      className="mt-2 bg-red-500 hover:bg-red-600 transition text-white px-3 py-1 rounded"
                    >
                      Cancel Order
                    </button>

                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-semibold animate-pulse">
                      ⚠️ Act fast! Cancel available for {minutes}:
                      {String(seconds).padStart(2, "0")}. Call the owner for
                      faster service.
                    </p>
                  </>
                ) : (
                  <p
                    className="text-xs text-gray-500 mt-1 cursor-pointer hover:underline"
                    onClick={() => (window.location.href = "tel:919545267216")}
                  >
                    Call the owner for faster service.
                  </p>
                );
              })()}
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Orders;
