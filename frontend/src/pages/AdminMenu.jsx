import { useEffect, useState } from "react";
import axios from "../api/axios";

function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await axios.get("/api/menu");
      setMenu(res.data);
    };
    fetchMenu();
  }, []);

  const toggleAvailability = async (id) => {
    const res = await axios.put(
      `/api/menu/${id}/toggle`,
      {},
      {
        headers: {
          "user-email": user.email,
        },
      },
    );

    setMenu((prev) => prev.map((item) => (item._id === id ? res.data : item)));
  };
  const updatePrice = async (id, price) => {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.put(
      `/api/menu/${id}/price`,
      { price },
      {
        headers: {
          "user-email": user.email,
        },
      },
    );

    setMenu((prev) => prev.map((item) => (item._id === id ? res.data : item)));
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 bg-[#0f0f0f] min-h-screen text-white">
      <h1 className="text-xl font-bold text-yellow-400 mb-5 text-center tracking-wide">
        🍽️ Menu Management
      </h1>

      <div className="space-y-4">
        {menu.map((item) => (
          <div
            key={item._id}
            className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-4 shadow-md hover:shadow-lg transition"
          >
            {/* Top Row */}
            <div className="flex justify-between items-center">
              <p className="font-semibold text-white text-base">{item.name}</p>

              <span
                className={`text-xs px-2 py-1 rounded-full font-semibold border ${
                  item.isAvailable
                    ? "bg-green-500/10 text-green-400 border-green-500/30"
                    : "bg-red-500/10 text-red-400 border-red-500/30"
                }`}
              >
                {item.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* Price Section */}
            <div className="mt-4 flex items-center justify-between gap-3">
              {/* Price Input */}
              <div className="flex items-center gap-2 bg-[#0f0f0f] border border-gray-700 rounded-lg px-3 py-2">
                <span className="text-gray-400 text-sm">₹</span>
                <input
                  type="number"
                  defaultValue={item.price}
                  onBlur={(e) => updatePrice(item._id, e.target.value)}
                  className="bg-transparent outline-none w-20 text-white font-semibold"
                />
              </div>

              {/* Toggle Button */}
              <div
                onClick={() => toggleAvailability(item._id)}
                className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-all ${
                  item.isAvailable ? "bg-green-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-all ${
                    item.isAvailable ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </div>
            </div>

            {/* Subtle hint */}
            <p className="text-xs text-gray-500 mt-3">
              Tap price to edit • Toggle availability instantly
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminMenu;
