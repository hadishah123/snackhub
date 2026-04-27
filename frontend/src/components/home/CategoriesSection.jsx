import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { categories } from "./categoryData";

function CategoriesSection() {
  const navigate = useNavigate();

  return (
    <section className="px-5 py-8">
      <h2 className="text-2xl font-bold mb-6">Popular Categories</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            onClick={() => navigate("/menu")}
            className="relative rounded-3xl overflow-hidden cursor-pointer group"
          >
            <img
              src={category.image}
              alt={category.name}
              className="h-36 w-full object-cover group-hover:scale-110 transition duration-500"
            />
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute bottom-3 left-3">
              <h3 className="font-bold text-lg">{category.name}</h3>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default CategoriesSection;