import { useEffect, useState } from "react";
import axios from "../api/axios";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function Menu() {
  const [foods, setFoods] = useState([]);

  const { dispatch } = useContext(CartContext);
  useEffect(() => {
    const fetchFoods = async () => {
      const { data } = await axios.get("/foods");
      setFoods(data);
    };
    fetchFoods();
  }, []);

  return (
    <div>
      <h2>Our Menu</h2>
      {foods.map((food) => (
        <div key={food._id}>
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