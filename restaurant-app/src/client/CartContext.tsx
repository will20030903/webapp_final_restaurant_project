// src/client/CartContext.tsx

/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState, useMemo } from "react";
import type { ReactNode } from "react";
import type { Dish } from "../models/Dish";
import type { SetMeal } from "../models/SetMeal";

/**
 * 1) 如果 type === "dish"，item 就一定是 Dish
 * 2) 如果 type === "set" ，item 就一定是 SetMeal
 */
export type CartItem =
  | {
      type: "dish";
      item: Dish;
      quantity: number;
    }
  | {
      type: "set";
      item: SetMeal;
      quantity: number;
    };

interface CartContextValue {
  items: CartItem[];
  addItem: (newItem: CartItem) => void;
  removeItem: (idx: number) => void;
  updateQuantity: (idx: number, qty: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart 必須置於 CartProvider 內");
  return ctx;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (newItem: CartItem) => {
    const itemName = newItem.type === "dish" ? newItem.item.dName : newItem.item.sName;
    alert(`已將 ${newItem.quantity} 個「${itemName}」加入購物車！`);
    setItems((prev) => {
      // 根據 type 分別處理：如果是 dish，就比對 dNo；如果是 set，就比對 sNo
      const idx = prev.findIndex((ci) => {
        if (ci.type === "dish" && newItem.type === "dish") {
          return ci.item.dNo === newItem.item.dNo;
        }
        if (ci.type === "set" && newItem.type === "set") {
          return ci.item.sNo === newItem.item.sNo;
        }
        return false;
      });

      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          quantity: updated[idx].quantity + newItem.quantity,
        };
        return updated;
      }
      return [...prev, newItem];
    });
  };

  const removeItem = (idx: number) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateQuantity = (idx: number, qty: number) => {
    setItems((prev) => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], quantity: qty };
      return updated;
    });
  };

  const clearCart = () => setItems([]);

  // useMemo 確保傳給 Provider 的物件不會在每次 render 都重建
  const value = useMemo(
    () => ({ items, addItem, removeItem, updateQuantity, clearCart }),
    [items]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
