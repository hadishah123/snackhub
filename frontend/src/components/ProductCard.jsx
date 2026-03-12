import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {

  const { cartItems, dispatch } = useContext(CartContext);

  const item = cartItems.find(i => i._id === product._id);

  const quantity = item ? item.quantity : 0;

  const addItem = () => {
    dispatch({ type: "ADD_TO_CART", payload: product });
  };

  const increase = () => {
    dispatch({ type: "INCREASE_QTY", payload: product._id });
  };

  const decrease = () => {
    dispatch({ type: "DECREASE_QTY", payload: product._id });
  };

  return (
    <div className="border rounded-lg p-4 shadow-sm flex flex-col justify-between">

      <div>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-lg" />
        <h3 className="text-md font-semibold">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mt-1">
          {product.description}
        </p>

        <p className="text-gray-600 text-sm">
          ₹{product.price}
        </p>
      </div>

      <div className="mt-3">

        {!product.isAvailable ? (

            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 py-2 rounded cursor-not-allowed"
            >
              Out of Stock
            </button>

          ) : quantity === 0 ? (

            <button
              onClick={addItem}
              className="w-full bg-black text-white py-2 rounded"
            >
              Add
            </button>

          ) : (

          <div className="flex items-center justify-between border rounded">

            <button
              onClick={decrease}
              className="px-3 py-1 text-lg"
            >
              −
            </button>

            <span className="font-semibold">
              {quantity}
            </span>

            <button
              onClick={increase}
              className="px-3 py-1 text-lg"
            >
              +
            </button>

          </div>

        )}

      </div>

    </div>
  );
}

export default ProductCard;