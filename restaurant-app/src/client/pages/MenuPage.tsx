// src/client/pages/MenuPage.tsx
import React, { useEffect, useState, useMemo } from "react";
import type { Dish } from "../../models/Dish";
import type { SetMeal } from "../../models/SetMeal";
import { fetchAllDishes } from "../../api/dishService";
import { fetchAllSetMeals } from "../../api/setMealService";
import DishCard from "../components/DishCard";
import SetMealCard from "../components/SetMealCard";

const MenuPage: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [allSets, setAllSets] = useState<SetMeal[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(0);
  const [minSetPrice, setMinSetPrice] = useState<number>(0);
  const [maxSetPrice, setMaxSetPrice] = useState<number>(0);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadDishes();
    loadSets();
  }, []);

  useEffect(() => {
    if (allSets.length > 0) {
      const prices = allSets.map(s => s.sPrice);
      const minP = Math.min(...prices);
      const maxP = Math.max(...prices);
      setMinSetPrice(minP);
      setMaxSetPrice(maxP);
      setMaxPrice(maxP);
    } else {
      setMinSetPrice(0);
      setMaxSetPrice(2000);
      setMaxPrice(2000);
    }
    // Initialize set meal section to be collapsed by default
    setCollapsedSections(prev => ({ ...prev, "套餐菜單": true }));
  }, [allSets]);

  async function loadDishes() {
    try {
      const arr = await fetchAllDishes();
      setDishes(arr);
      // Initialize dish sections to be collapsed by default
      const initialCollapsedState: Record<string, boolean> = {};
      const dishTypes = new Set(arr.map(d => d.dType || "其他"));
      dishTypes.forEach(type => {
        initialCollapsedState[type] = true; // Default to collapsed
      });
      setCollapsedSections(prev => ({ ...prev, ...initialCollapsedState }));
    } catch (err) {
      console.error(err);
    }
  }

  async function loadSets() {
    try {
      const arr = await fetchAllSetMeals();
      setAllSets(arr);
    } catch (err) {
      console.error(err);
    }
  }

  const toggleSection = (sectionName: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName],
    }));
  };

  const groupedDishes = useMemo(() => {
    return dishes.reduce((acc, dish) => {
      const type = dish.dType || "其他";
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push(dish);
      return acc;
    }, {} as Record<string, Dish[]>);
  }, [dishes]);

  const filteredSets = useMemo(() => {
    const currentMax = minSetPrice > 0 && maxPrice < minSetPrice ? minSetPrice : maxPrice;
    return allSets.filter(set => set.sPrice <= currentMax);
  }, [allSets, maxPrice, minSetPrice]);

  return (
    <div className="space-y-2"> {/* Reduced space-y for tighter sections */}
      {Object.entries(groupedDishes).map(([type, dishList]) => (
        <div key={type} className="py-2"> {/* Added padding for section separation */}
          <h2 
            className="text-2xl font-semibold mb-2 capitalize cursor-pointer flex items-center" 
            onClick={() => toggleSection(type)}
          >
            {type}
            <span className="ml-2 text-lg">
              {collapsedSections[type] ? "▶" : "▼"}
            </span>
          </h2>
          {!collapsedSections[type] && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-1">
              {dishList.map((d) => (
                <DishCard key={d.dNo} dish={d} />
              ))}
            </div>
          )}
        </div>
      ))}

      {allSets.length > 0 && (
        <div className="py-2"> {/* Added padding for section separation */}
          <h2 
            className="text-2xl font-semibold mt-6 mb-2 cursor-pointer flex items-center" // Added mt-6 for more space before this section
            onClick={() => toggleSection("套餐菜單")}
          >
            套餐菜單
            <span className="ml-2 text-lg">
              {collapsedSections["套餐菜單"] ? "▶" : "▼"}
            </span>
          </h2>
          {!collapsedSections["套餐菜單"] && (
            <>
              <div className="mb-6 p-4 border rounded-lg shadow bg-gray-50 mt-1">
                <label htmlFor="price-slider" className="block mb-2 text-lg font-medium text-gray-700">
                  最高價格： NT$ {maxPrice < minSetPrice && minSetPrice > 0 ? minSetPrice : maxPrice} 
                </label>
                <input
                  id="price-slider"
                  type="range"
                  min={minSetPrice} 
                  max={maxSetPrice}
                  value={maxPrice < minSetPrice && minSetPrice > 0 ? minSetPrice : maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  disabled={minSetPrice === 0 && maxSetPrice === 0}
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>NT$ {minSetPrice}</span>
                  <span>NT$ {maxSetPrice}</span>
                </div>
              </div>

              {filteredSets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredSets.map((s) => (
                    <SetMealCard key={s.sNo} setMeal={s} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">沒有符合價格範圍的套餐。</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
