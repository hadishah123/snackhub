import { useNavigate } from "react-router-dom";
import { FaBox } from "react-icons/fa";

function AdminOrdersButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/admin")}
      className="fixed bottom-42 right-4 bg-yellow-400 text-black px-4 py-2 rounded-full shadow-lg flex items-center gap-2 font-semibold hover:scale-105 transition"
    >
      <FaBox />
      Admin Orders
    </button>
  );
}

export default AdminOrdersButton;