import ProductCard from "../components/ProductCard";
import StickyCartButton from "../components/StickyCartButton";
import axios from "../api/axios";
import { useEffect, useState } from "react";

function Menu() {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const res = await axios.get("/api/menu");

      setMenu(res.data);
    };

    fetchMenu();
  }, []);

  return (
    <div className="p-4">
      <div
        className="grid gap-4
                      grid-cols-1       /* mobile default: 1 column */
                      sm:grid-cols-2    /* small screens >= 640px: 2 columns */
                      md:grid-cols-3    /* medium screens >= 768px: 3 columns */
                      lg:grid-cols-4    /* large screens >= 1024px: 4 columns */
                      xl:grid-cols-5" /* extra large screens >= 1280px: 5 columns */
      >
        {menu.map((food) => (
          <ProductCard key={food._id} product={food} />
        ))}
      </div>
      <StickyCartButton />
    </div>
  );
}

export default Menu;
