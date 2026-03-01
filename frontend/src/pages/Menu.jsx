import { useState, useContext } from "react";
import menuData from "../data/menu.json";
import { CartContext } from "../context/CartContext";

function Menu() {
  const [foods] = useState(menuData); // static data

  const { dispatch } = useContext(CartContext);

  return (
    <div>
      <h2>Our Menu</h2>

      {foods.map((food) => (
        <div key={food.id}>
          <h3>{food.name}</h3>
          <p>{food.description}</p>
          <p>₹{food.price}</p>

          <button
            onClick={() =>
              dispatch({ type: "ADD_TO_CART", payload: food })
            }
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}

export default Menu;