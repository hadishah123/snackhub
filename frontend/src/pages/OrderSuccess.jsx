import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/orders");
    }, 3000);

    // 🔒 Lock body scroll
    document.body.style.overflow = "hidden";

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "auto"; // restore
    };
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#0f0f0f] px-5 text-center overflow-hidden">
      
      {/* Glow */}
      <div className="absolute w-60 h-60 bg-yellow-400/10 blur-3xl rounded-full top-20"></div>

      {/* Content */}
      <div className="flex flex-col items-center">
        <div className="text-5xl mb-4">🍿</div>

        <h1 className="text-2xl font-bold text-yellow-400">
          Order Confirmed
        </h1>

        <p className="text-sm text-gray-400 mt-2 max-w-xs">
          Your snacks are being prepared. Sit tight — good food is coming.
        </p>

        <button
          onClick={() => navigate("/orders")}
          className="mt-6 px-7 py-3 bg-green-500 active:scale-95 text-black font-semibold rounded-xl transition-all duration-200 shadow-md"
        >
          View Orders
        </button>

        <div className="mt-4 flex items-center space-x-1 text-xs text-gray-500">
          <span>Auto redirecting</span>
          <span className="flex space-x-1">
            <span className="animate-bounce">.</span>
            <span className="animate-bounce [animation-delay:0.2s]">.</span>
            <span className="animate-bounce [animation-delay:0.4s]">.</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;