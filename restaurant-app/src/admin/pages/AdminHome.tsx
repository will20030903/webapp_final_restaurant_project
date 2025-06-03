// src/admin/pages/AdminHome.tsx
import React, { useEffect, useState, useCallback } from "react";
import { fetchAllOrders } from "../../api/orderService";
import { fetchAllDishes } from "../../api/dishService";
import { fetchAllSetMeals } from "../../api/setMealService";
import type { OrderInfo } from "../../models/OrderInfo";
import type { Dish } from "../../models/Dish";
import type { SetMeal } from "../../models/SetMeal";
import type { OrderDetail } from "../../models/OrderDetail";
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart as RechartsBarChart, // Alias to avoid conflict with Bar component
} from "recharts";

interface HourlyData {
  hour: string;
  salesCount: number; // Number of orders
  salesAmount: number; // Sum of total prices for orders in that hour
  cumulativeSales: number;
}

interface TopItemData {
  name: string;
  quantity: number;
}

const AdminHome: React.FC = () => {
  const [overallOrderCount, setOverallOrderCount] = useState(0);
  const [liveTodaySales, setLiveTodaySales] = useState(0);

  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().slice(0, 10)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allDishes, setAllDishes] = useState<Dish[]>([]);
  const [allSetMeals, setAllSetMeals] = useState<SetMeal[]>([]);
  const [allOrders, setAllOrders] = useState<OrderInfo[]>([]);

  const [totalSalesForDay, setTotalSalesForDay] = useState<number>(0);
  const [hourlyChartData, setHourlyChartData] = useState<HourlyData[]>([]);
  const [topItemsChartData, setTopItemsChartData] = useState<TopItemData[]>(
    []
  );

  const loadOverallStats = useCallback(async () => {
    try {
      const orders = await fetchAllOrders();
      setAllOrders(orders); 
      setOverallOrderCount(orders.length);

      const today = new Date().toISOString().slice(0, 10);
      const total = orders
        .filter((o) => o.oDateTime.startsWith(today))
        .reduce((sum, o) => sum + o.totalPrice, 0);
      setLiveTodaySales(total);
    } catch (err) {
      console.error("Failed to load overall stats:", err);
    }
  }, []);

  const loadDishesAndSetMeals = useCallback(async () => {
    try {
      const [dishes, setMeals] = await Promise.all([
        fetchAllDishes(),
        fetchAllSetMeals(),
      ]);
      setAllDishes(dishes);
      setAllSetMeals(setMeals);
    } catch (err) {
      console.error("Failed to load dishes or set meals:", err);
    }
  }, []);

  useEffect(() => {
    loadOverallStats();
    loadDishesAndSetMeals();
  }, [loadOverallStats, loadDishesAndSetMeals]);

  const processDataForSelectedDate = useCallback(() => {
    if (!selectedDate || allDishes.length === 0 || allSetMeals.length === 0 || allOrders.length === 0) {
      setTotalSalesForDay(0);
      setHourlyChartData([]);
      setTopItemsChartData([]);
      return;
    }
    setIsLoading(true);

    const ordersForDate = allOrders.filter((o) =>
      o.oDateTime.startsWith(selectedDate)
    );

    // Debug: Inspect ordersForDate and the length of their orderDetailses
    console.log(
      `[AdminHome Debug] Orders for date ${selectedDate}: Count = ${ordersForDate.length}`,
      ordersForDate.map(o => ({ oId: o.oId, orderDetailsCount: o.orderDetailses.length, totalPrice: o.totalPrice }))
    );

    const dailyTotal = ordersForDate.reduce((sum, o) => sum + o.totalPrice, 0);
    setTotalSalesForDay(dailyTotal);

    const hourlySalesArray: HourlyData[] = Array(24)
      .fill(null)
      .map((_, i) => ({
        hour: `${String(i).padStart(2, "0")}:00`,
        salesCount: 0,
        salesAmount: 0,
        cumulativeSales: 0,
      }));

    let cumulativeAmount = 0;
    for (let i = 0; i < 24; i++) {
      const ordersInHour = ordersForDate.filter((o) => {
        try {
          const orderDate = new Date(o.oDateTime);
          return orderDate.getHours() === i;
        } catch (e) {
          console.error("Error parsing oDateTime:", o.oDateTime, e);
          return false;
        }
      });
      
      hourlySalesArray[i].salesCount = ordersInHour.length;
      hourlySalesArray[i].salesAmount = ordersInHour.reduce(
        (sum, o) => sum + o.totalPrice,
        0
      );
      cumulativeAmount += hourlySalesArray[i].salesAmount;
      hourlySalesArray[i].cumulativeSales = cumulativeAmount;
    }
    setHourlyChartData(hourlySalesArray);

    const itemQuantities: { [key: string]: TopItemData } = {};
    ordersForDate.forEach((order) => {
      order.orderDetailses.forEach((detail: OrderDetail) => {
        let itemName: string | undefined;
        let itemKey: string;

        // Log the current detail object
        console.log("[AdminHome Detail Loop] Current detail:", JSON.parse(JSON.stringify(detail)));

        if (detail.itemType === "dish") {
          const dish = allDishes.find((d) => d.dNo === detail.itemId);
          itemName = dish?.dName;
          itemKey = `dish-${detail.itemId}`;
        } else {
          const setMeal = allSetMeals.find((s) => s.sNo === detail.itemId);
          itemName = setMeal?.sName;
          itemKey = `set-${detail.itemId}`;
        }

        // Log itemKey and itemName
        console.log(`[AdminHome Detail Loop] Derived itemKey: ${itemKey}, itemName: ${itemName}`);

        if (itemName) {
          // Log itemQuantities BEFORE update
          console.log("[AdminHome Detail Loop] itemQuantities BEFORE update for key " + itemKey + ":", JSON.parse(JSON.stringify(itemQuantities)));
          
          if (itemQuantities[itemKey]) {
            itemQuantities[itemKey].quantity += detail.quantity;
          } else {
            itemQuantities[itemKey] = {
              name: itemName,
              quantity: detail.quantity,
            };
          }
          // Log itemQuantities AFTER update
          console.log("[AdminHome Detail Loop] itemQuantities AFTER update for key " + itemKey + ":", JSON.parse(JSON.stringify(itemQuantities)));
          
        } else {
          console.log(
            `[AdminHome Debug] Item not found or name missing: itemType=${detail.itemType}, itemId=${detail.itemId}, orderId=${order.oId}. Result of find in allDishes/allSetMeals:`,
            detail.itemType === "dish" ? allDishes.find(d => d.dNo === detail.itemId) : allSetMeals.find(s => s.sNo === detail.itemId)
          );
        }
      });
    });

    // Debug: Log the populated itemQuantities object
    console.log("[AdminHome Debug] Populated itemQuantities:", JSON.parse(JSON.stringify(itemQuantities)));

    const sortedItems = Object.values(itemQuantities)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
    
    // Debug: Log the final sortedItems array for the chart
    console.log("[AdminHome Debug] Sorted top items for chart:", sortedItems);

    setTopItemsChartData(sortedItems);

    setIsLoading(false);
  }, [selectedDate, allDishes, allSetMeals, allOrders]);
  
  useEffect(() => {
    processDataForSelectedDate();
  }, [processDataForSelectedDate]);

  const handleQuery = () => {
     processDataForSelectedDate();
  };
  
  const formatCurrency = (value: number) => `NT$${value.toLocaleString()}`;
  const formatHourForDisplay = (hourStr: string) => hourStr.split(":")[0];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">管理端儀表板</h1>
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow flex flex-col items-center">
          <span className="text-4xl font-semibold">{overallOrderCount}</span>
          <span className="mt-2 text-gray-600">總訂單數</span>
        </div>
        <div className="bg-white p-6 rounded shadow flex flex-col items-center">
          <span className="text-4xl font-semibold">{formatCurrency(liveTodaySales)}</span>
          <span className="mt-2 text-gray-600">今日銷售額</span>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t">
        <div className="flex items-center space-x-4 mb-4">
          <label htmlFor="date-picker" className="text-lg">
            日期:
          </label>
          <input
            type="date"
            id="date-picker"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <button
            onClick={handleQuery}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? "查詢中..." : "查詢"}
          </button>
        </div>

        {isLoading && <p>讀取分析資料中...</p>}
        {!isLoading && (
          <>
            <p className="text-xl font-semibold mb-4">
              當天總銷售額：{formatCurrency(totalSalesForDay)}
            </p>

            <div className="mb-8 bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">每小時銷售數量與累積銷售額</h3>
              {hourlyChartData.length > 0 || selectedDate ? (
                <ResponsiveContainer width="100%" height={400}>
                  <ComposedChart data={hourlyChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" tickFormatter={formatHourForDisplay} interval="preserveStartEnd" />
                    <YAxis yAxisId="left" label={{ value: '銷售數量', angle: -90, position: 'insideLeft' }} allowDecimals={false} />
                    <YAxis yAxisId="right" orientation="right" label={{ value: '銷售額', angle: -90, position: 'insideRight', offset:10 }} tickFormatter={formatCurrency} />
                    <Tooltip
                      formatter={(value: number | string, name: string): [string | number, string] => {
                        if (name === "銷售數量") return [value, "銷售數量"];
                        if (name === "累積銷售額") return [formatCurrency(value as number), "累積銷售額"];
                        return [value, name];
                      }}
                    />
                    <Legend />
                    <Bar yAxisId="left" dataKey="salesCount" name="銷售數量" fill="#FFC658" barSize={20} />
                    <Line yAxisId="right" type="monotone" dataKey="cumulativeSales" name="累積銷售額" stroke="#82ca9d" strokeWidth={2} dot={false} />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <p>該日期無銷售資料可繪製圖表。</p>
              )}
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2">最熱銷的前5名餐點</h3>
              {topItemsChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsBarChart layout="vertical" data={topItemsChartData} margin={{ top: 5, right: 30, left: 120, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="name" type="category" width={150} interval={0} />
                    <Tooltip formatter={(value: number): [string, string] => [`${value}`, "數量"]} />
                    <Legend />
                    <Bar dataKey="quantity" name="數量" fill="#8884d8" barSize={20} />
                  </RechartsBarChart>
                </ResponsiveContainer>
              ) : (
                <p>該日期無銷售資料可分析熱銷餐點。</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
