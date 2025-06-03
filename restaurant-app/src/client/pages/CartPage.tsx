// src/client/pages/CartPage.tsx
import React from "react";
import type { CartItem as CartItemType } from "../CartContext";
import { useCart } from "../CartContext";
import CartItem from "../components/CartItem";
import { Link, useNavigate } from "react-router-dom";

const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();

  // 計算總金額：依據 ci.type 自動縮小 ci.item 的型別
  const totalAmount = items.reduce((sum, ci) => {
    const price = ci.type === "dish" ? ci.item.dPrice : ci.item.sPrice;
    return sum + price * ci.quantity;
  }, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">購物車</h2>
      {items.length === 0 ? (
        <p>
          目前購物車是空的。{" "}
          <Link to="/client/menu" className="text-blue-500 hover:underline">
            去選購菜單
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          {items.map((ci: CartItemType, idx: number) => {
            const key =
              ci.type === "dish"
                ? `dish-${ci.item.dNo}`
                : `set-${ci.item.sNo}`;
            return (
              <CartItem
                key={key}
                cartItem={ci}
                onRemove={() => removeItem(idx)}
                onUpdateQty={(qty: number) => updateQuantity(idx, qty)}
              />
            );
          })}

          <div className="flex justify-between items-center mt-6">
            <p className="text-xl">
              總金額：<span className="font-bold">NT$ {totalAmount}</span>
            </p>
            <div className="space-x-2">
              <button
                onClick={() => navigate("/client/checkout")}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                前往結帳
              </button>
              <button
                onClick={clearCart}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                清空購物車
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
