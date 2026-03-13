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

  const res = await axios.put(`/api/menu/${id}/toggle`,
    {},
    {
      headers: {
        "user-email": user.email
      }
    }
  );

  setMenu(prev =>
    prev.map(item =>
      item._id === id ? res.data : item
    )
  );

};
const updatePrice = async (id, price) => {

  const user = JSON.parse(localStorage.getItem("user"));

  const res = await axios.put(
    `/api/menu/${id}/price`,
    { price },
    {
      headers: {
        "user-email": user.email
      }
    }
  );

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
  className="border p-3 mb-3 rounded"
>

  <p className="font-semibold">{item.name}</p>

  <div className="flex gap-2 mt-2">

    <input
      type="number"
      defaultValue={item.price}
      onBlur={(e) => updatePrice(item._id, e.target.value)}
      className="border px-2 py-1 rounded w-24"
    />

    <button
      onClick={() => toggleAvailability(item._id)}
      className={`px-3 py-1 rounded text-white ${
        item.isAvailable ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {item.isAvailable ? "Available" : "Unavailable"}
    </button>

  </div>

</div>


      ))}

    </div>
  );
}

export default AdminMenu;
