import ProductCard from "../components/ProductCard";
import StickyCartButton from "../components/StickyCartButton";
import axios from "../api/axios";
import { useEffect, useState } from "react";
import MenuSkeleton from "../components/MenuSkeleton";
import EmptyState from "../components/EmptyState";

function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get("/api/menu");
        setMenu(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  return (
    <>
      {error ? (
        <EmptyState title="Error" description={error} />
      ) : loading ? (
        <MenuSkeleton />
      ) : menu.length === 0 ? (
        <EmptyState
          title="No food available 🍽️"
          description="Please check back later"
        />
      ) : (
        <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8 gap-6 pb-24">
          {menu.map((food) => (
            <ProductCard key={food._id} product={food} />
          ))}
        </div>
      )}
      <StickyCartButton />
    </>
  );
}

export default Menu;
