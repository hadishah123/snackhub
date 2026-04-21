import WhatsAppButton from "./../components/WhatsAppButton";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <WhatsAppButton />

      <div className="relative min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-5 text-center overflow-hidden">
        
        {/* Soft glow */}
        <div className="absolute w-72 h-72 bg-yellow-400/10 blur-3xl rounded-full top-20"></div>

        {/* Content */}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-yellow-400 mb-3">
          SnackHub
        </h1>

        <p className="text-base sm:text-lg text-gray-300 max-w-xs leading-relaxed">
          Craving something tasty?  
          Fresh momos and snacks are just a tap away.
        </p>

        {/* Softer CTA */}
        <button
          onClick={() => navigate("/menu")}
          className="mt-8 px-7 py-3 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-xl shadow-lg shadow-green-500/20 active:scale-95 transition-all"
        >
          Browse Menu
        </button>

        {/* Optional trust line */}
        <p className="mt-4 text-xs text-gray-500">
          Fast delivery • Freshly made
        </p>
      </div>
    </>
  );
}

export default Home;