import ProductCard from "../components/ProductCard";
import StickyCartButton from "../components/StickyCartButton";
import axios from "../api/axios";
import { useEffect, useState, useContext } from "react";
import MenuSkeleton from "../components/MenuSkeleton";
import EmptyState from "../components/EmptyState";
import { AuthContext } from "../context/AuthContext";
import ManageMenu from "../components/ManageMenu";
import { motion } from "framer-motion";
import SortBar from "../components/SortBar";

function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sort, setSort] = useState("all");

  const { user } = useContext(AuthContext);
  const isAdmin = user?.email === "admin@snackhub.com";

  // FETCH
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("/api/menu");
        setMenu(res.data);
      } catch (err) {
        setError("Failed to load menu", err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // CATEGORY ORDER
  const categoryOrder = ["Momos", "Sandwich", "Mocktail", "Wrap"];

  const dynamicCategories = [...new Set(menu.map((i) => i.category))];

  const categories = [
    "All",
    ...categoryOrder.filter((c) => dynamicCategories.includes(c)),
    ...dynamicCategories.filter((c) => !categoryOrder.includes(c)),
  ];

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSort("all"); // reset
  };

  // 🔥 DERIVED DATA (PURE)

 let filteredMenu = [...menu];

// 1. CATEGORY FILTER
if (selectedCategory !== "All") {
  filteredMenu = filteredMenu.filter(
    (item) => item.category === selectedCategory
  );
}

// 2. SORT / TRENDING LOGIC
// if (sort === "trending") {
//   filteredMenu = filteredMenu.filter(
//     (item) => item.isTrending === true || item.isTrending === "true"
//   );
// }
if (sort === "trending") {
  filteredMenu = filteredMenu.filter(
    (item) => Boolean(item.isTrending) === true
  );
}

if (sort === "low-high") {
  filteredMenu.sort((a, b) => a.price - b.price);
}

if (sort === "high-low") {
  filteredMenu.sort((a, b) => b.price - a.price);
}
  return (
    <>
      {error ? (
        <EmptyState title="Error" description={error} />
      ) : loading ? (
        <MenuSkeleton />
      ) : (
        <div className="max-w-3xl mx-auto px-4 py-4 pb-28">

          {/* CATEGORY CHIPS */}
          <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap border transition ${
                  selectedCategory === cat
                    ? "bg-yellow-400 text-black border-yellow-400"
                    : "bg-black text-gray-300 border-gray-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SORT BAR */}
          <SortBar sort={sort} setSort={setSort} />

          {/* ITEMS */}
          {filteredMenu.length === 0 ? (
            <EmptyState
              title="No trending items"
              description="Try another filter"
            />
          ) : (
            filteredMenu.map((food) => (
              <motion.div
                key={food._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <ProductCard product={food} />
              </motion.div>
            ))
          )}
        </div>
      )}

      {isAdmin && <ManageMenu />}
      <StickyCartButton />
    </>
  );
}

export default Menu;