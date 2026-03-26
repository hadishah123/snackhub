import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OrderSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home after 3 seconds
    const timer = setTimeout(() => {
      navigate("/menu");
    }, 3000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-orange-50 text-center px-4">
      {/* A little snack-themed icon or emoji */}
      <div className="text-6-xl mb-4">🍿</div>
      
      <h1 className="text-4xl font-bold text-green-600 mb-2">
        Order Placed Successfully!
      </h1>
      
      <p className="text-lg text-gray-700">
        Your snacks are being prepped and will be ready for munching soon.
      </p>

      <div className="mt-8 flex items-center space-x-2 text-sm text-gray-400">
        <span>Taking you back to the shop</span>
        <span className="flex space-x-1">
          <span className="animate-bounce">.</span>
          <span className="animate-bounce [animation-delay:0.2s]">.</span>
          <span className="animate-bounce [animation-delay:0.4s]">.</span>
        </span>
      </div>
    </div>
  );
}

export default OrderSuccess;