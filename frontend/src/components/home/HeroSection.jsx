import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden px-5 pt-16 pb-14 text-center">
      <div className="absolute inset-0 bg-linear-to-b from-yellow-400/10 via-transparent to-transparent" />
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-80 h-80 bg-yellow-400/10 blur-3xl rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="relative z-10"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold text-yellow-400 mb-4">
          SnackHub
        </h1>

        <p className="text-gray-300 text-lg max-w-xl mx-auto leading-relaxed">
          Craving something delicious? Fresh momos, wraps, sandwiches, and
          refreshing mocktails delivered fast.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/menu")}
            className="bg-yellow-400 text-black font-bold px-8 py-3 rounded-2xl hover:scale-105 transition"
          >
            Order Now
          </button>

          <button
            onClick={() => navigate("/menu")}
            className="border border-gray-700 px-8 py-3 rounded-2xl text-white hover:border-yellow-400 hover:text-yellow-400 transition"
          >
            Explore Menu
          </button>
        </div>

        <p className="mt-5 text-sm text-gray-500">
          Fast delivery • Freshly prepared • Live tracking
        </p>
      </motion.div>
    </section>
  );
}

export default HeroSection;