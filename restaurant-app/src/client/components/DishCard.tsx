// src/client/components/DishCard.tsx
import React, { useState } from "react";
import type { Dish } from "../../models/Dish";
import { useCart } from "../CartContext";

interface Props {
  dish: Dish;
}

const DishCard: React.FC<Props> = ({ dish }) => {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const handleAdd = () => {
    addItem({ type: "dish", item: dish, quantity: qty });
    setQty(1);
  };

  return (
    <div className="border rounded-lg p-4 shadow hover:shadow-md flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-semibold mb-1">{dish.dName}</h3>
        <p className="text-gray-600 mb-2">{dish.dDesc}</p>
        <p className="text-green-600 font-bold mb-2">NT$ {dish.dPrice}</p>
        <p className="text-sm text-gray-500">類別：{dish.dType}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <input
          type="number"
          min={1}
          value={qty}
          onChange={(e) => setQty(Math.max(1, +e.target.value))}
          className="w-16 border px-2 py-1 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          加入購物車
        </button>
      </div>
    </div>
  );
};

export default DishCard;
