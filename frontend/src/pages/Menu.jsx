import menuData from "../data/menu.json";
import ProductCard from "../components/ProductCard";

function Menu() {
  return (
    <div className="grid grid-cols-3 gap-6 p-6">
      {menuData.map((food) => (
        <ProductCard key={food._id} product={food} />
      ))}
    </div>
  );
}

export default Menu;