import { motion } from "framer-motion";
import { FaMotorcycle, FaLeaf, FaStar } from "react-icons/fa";

const features = [
  {
    icon: <FaMotorcycle className="text-2xl text-yellow-400" />,
    title: "Fast Delivery",
    desc: "Hot and fresh at your doorstep.",
  },
  {
    icon: <FaLeaf className="text-2xl text-yellow-400" />,
    title: "Fresh Ingredients",
    desc: "Prepared with premium quality ingredients.",
  },
  {
    icon: <FaStar className="text-2xl text-yellow-400" />,
    title: "Top Rated",
    desc: "Loved by foodies across the city.",
  },
];

function FeaturesSection() {
  return (
    <section className="px-5 py-10">
      <h2 className="text-2xl font-bold mb-6">Why Choose Us</h2>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            className="bg-[#121212] border border-gray-800 rounded-3xl p-6"
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default FeaturesSection;