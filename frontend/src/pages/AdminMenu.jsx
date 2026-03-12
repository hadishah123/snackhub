import { useEffect, useState } from "react";
import axios from "../api/axios";

function AdminMenu() {

  const [menu, setMenu] = useState([]);

  useEffect(() => {
        const fetchMenu = async () => {
        const res = await axios.get("/api/menu");
        setMenu(res.data);
      };
    fetchMenu();
  }, []);


  const toggleAvailability = async (id) => {

  const res = await axios.put(`/api/menu/${id}/toggle`);

  setMenu(prev =>
    prev.map(item =>
      item._id === id ? res.data : item
    )
  );

};


  return (
    <div className="max-w-md mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">
        Menu Management
      </h1>

      {menu.map(item => (

        <div
          key={item._id}
          className="flex justify-between items-center border p-3 mb-3 rounded"
        >

          <div>

            <p className="font-semibold">
              {item.name}
            </p>

            <p className="text-sm text-gray-500">
              ₹{item.price}
            </p>

          </div>

          <button
            onClick={() => toggleAvailability(item._id)}
            className={`px-3 py-1 rounded text-white ${
              item.isAvailable ? "bg-green-500" : "bg-red-500"
            }`}
          >

            {item.isAvailable ? "Available" : "Unavailable"}

          </button>

        </div>

      ))}

    </div>
  );
}

export default AdminMenu;
