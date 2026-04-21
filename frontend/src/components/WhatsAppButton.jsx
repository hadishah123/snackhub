import { FaWhatsapp } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "../api/axios";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import socket from "../socket";

function WhatsAppButton() {
  const [orders, setOrders] = useState([]);
  const [userEmail, setUserEmail] = useState(null);
  const phone = "919545267216";

  const auth = getAuth();

  // 🔹 Get current user email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email);
    });
    return unsubscribe;
  }, [auth]);

  // 🔹 Fetch orders once userEmail is ready
  useEffect(() => {
    if (!userEmail) return;

    const fetchOrders = async () => {
      try {
        const res = await axios.get(`/api/orders/user/${userEmail}`);
        const sorted = res.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );
        setOrders(sorted);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, [userEmail]);

  // 🔹 Socket real-time updates
  useEffect(() => {
    socket.on("orderUpdated", (updatedOrder) => {
      setOrders((prev) => {
        const exists = prev.find((o) => o._id === updatedOrder._id);
        if (exists) {
          return prev.map((o) =>
            o._id === updatedOrder._id ? updatedOrder : o,
          );
        } else {
          return [updatedOrder, ...prev];
        }
      });
    });

    return () => socket.off("orderUpdated");
  }, []);

  // 🔹 Generate WhatsApp message
  const latestOrder = orders?.[0];

  const message =
    latestOrder && latestOrder.orderStatus?.toLowerCase() !== "delivered"
      ? `Hi! I'm checking my order (${latestOrder._id.toUpperCase().slice(-6)}).

Items: ${latestOrder.items
          .map((item) => `${item.name} x${item.quantity}`)
          .join(", ")}.

Total: ₹${latestOrder.totalAmount}.
Payment: ${latestOrder.paymentMethod}.
Status: ${latestOrder.orderStatus}.

Can you help me with this order?`
      : `Hi! I'm interested in SnackHub. Can you help me with the menu or my orders?`;

  return (
    <a
      href={`https://wa.me/${phone}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-black px-5 py-3 rounded-full shadow-lg z-50 transition-all mb-9"
    >
      <span className="sm:hidden font-semibold">Chat</span>
      <FaWhatsapp className="text-xl" />
      <span className="hidden sm:inline font-semibold">WhatsApp</span>
    </a>
  );
}

export default WhatsAppButton;
