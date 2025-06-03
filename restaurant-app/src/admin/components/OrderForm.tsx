// src/admin/components/OrderForm.tsx
import React, { useState, useEffect } from "react";
import type { OrderInfo } from "../../models/OrderInfo";
import type { TableInfo } from "../../models/TableInfo";
import type { Dish } from "../../models/Dish";
import type { SetMeal } from "../../models/SetMeal";
import type { Customer } from "../../models/Customer";
import { fetchAllTables } from "../../api/tableService";
import { fetchAllDishes } from "../../api/dishService";
import { fetchAllSetMeals } from "../../api/setMealService";
import { fetchAllCustomers } from "../../api/customerService";
import { formatDateToGMT8_YYYYMMDDTHHMM } from "../../utils/dateTimeUtils";


/**
 * 送給後端的 OrderDetail 資料（不含 odId、itemType，只有 dishOrSetType、itemId、quantity、subTotal）
 */
export interface OrderDetailPayload {
  dishOrSetType: "dish" | "set";
  itemId: number;
  quantity: number;
  subTotal: number;
}

interface Props {
  /**
   * initialData=null → 新增模式
   * initialData=OrderInfo → 編輯模式，帶入欄位預設值
   */
  initialData: OrderInfo | null;
  onCancel: () => void;
  /**
   * onSubmit 只接收後端需要的完整資料：
   * {
   *   oDateTime: string;
   *   totalPrice: number;
   *   payStatus: string;
   *   customerId: number;
   *   tableId: number;
   *   orderDetailses: OrderDetailPayload[];
   * }
   */
  onSubmit: (data: {
    oDateTime: string;
    totalPrice: number;
    payStatus: string;
    customerId: number;
    tableId: number;
    orderDetailses: OrderDetailPayload[];
  }) => void;
}

const OrderForm: React.FC<Props> = ({ initialData, onCancel, onSubmit }) => {
  // 訂單主欄位
  const [oDateTime, setODateTime] = useState<string>(
    initialData ? initialData.oDateTime : formatDateToGMT8_YYYYMMDDTHHMM(new Date())
  );
  const [totalPrice, setTotalPrice] = useState<number>(
    initialData ? initialData.totalPrice : 0
  );
  const [payStatus, setPayStatus] = useState<string>(
    initialData ? initialData.payStatus : "未付款"
  );
  const [customerId, setCustomerId] = useState<number>(
    initialData ? initialData.customerId! : 0
  );
  const [tableId, setTableId] = useState<number>(
    initialData ? initialData.tableId! : 0
  );

  // Added state for available selections
  const [availableTables, setAvailableTables] = useState<TableInfo[]>([]);
  const [availableDishes, setAvailableDishes] = useState<Dish[]>([]);
  const [availableSetMeals, setAvailableSetMeals] = useState<SetMeal[]>([]);
  const [availableCustomers, setAvailableCustomers] = useState<Customer[]>([]);

  // 訂單明細欄位（使用 OrderDetailPayload 型別）
  const [details, setDetails] = useState<OrderDetailPayload[]>(
    initialData
      ? initialData.orderDetailses.map((d) => ({
          dishOrSetType: d.itemType,
          itemId: d.itemId,
          quantity: d.quantity,
          subTotal: d.subTotal,
        }))
      : []
  );

  // 如果切換 initialData，就把欄位重設
  useEffect(() => {
    if (initialData) {
      setODateTime(initialData.oDateTime);
      setTotalPrice(initialData.totalPrice);
      setPayStatus(initialData.payStatus);
      setCustomerId(initialData.customerId ?? 0);
      setTableId(initialData.tableId ?? 0);
      setDetails(
        initialData.orderDetailses.map((d) => ({
          dishOrSetType: d.itemType,
          itemId: d.itemId,
          quantity: d.quantity,
          subTotal: d.subTotal,
        }))
      );
    } else {
      setODateTime(formatDateToGMT8_YYYYMMDDTHHMM(new Date()));
      setTotalPrice(0);
      setPayStatus("未付款");
      setCustomerId(0);
      setTableId(0);
      setDetails([]);
    }
  }, [initialData]);

  // Added: Fetch data for dropdowns
  useEffect(() => {
    const loadDropdownData = async () => {
      try {
        const tables = await fetchAllTables();
        setAvailableTables(tables);
        const dishes = await fetchAllDishes();
        setAvailableDishes(dishes);
        const setMeals = await fetchAllSetMeals();
        setAvailableSetMeals(setMeals);
        const customers = await fetchAllCustomers();
        setAvailableCustomers(customers);
      } catch (error) {
        console.error("Failed to load dropdown data", error);
        // Optionally, set an error state to display to the user
      }
    };
    loadDropdownData();
  }, []); // Empty dependency array ensures this runs once on mount

  // 計算訂單總價
  useEffect(() => {
    const sum = details.reduce((acc, d) => acc + d.subTotal, 0);
    setTotalPrice(sum);
  }, [details]);

  // 新增一筆明細預設空值
  const handleAddDetail = () => {
    setDetails((prev) => [
      ...prev,
      { dishOrSetType: "dish", itemId: 0, quantity: 1, subTotal: 0 },
    ]);
  };

  // 移除第 idx 筆明細
  const handleRemoveDetail = (idx: number) => {
    setDetails((prev) => prev.filter((_, i) => i !== idx));
  };

  // 修改第 idx 筆明細欄位
  const handleChangeDetail = (
    idx: number,
    field:
      | "dishOrSetType"
      | "itemId"
      | "quantity"
      | "subTotal",
    value: string | number
  ) => {
    setDetails((prev) => {
      const updated = [...prev];
      const detail: OrderDetailPayload = { ...updated[idx] };

      detail[field] = value as never; // Apply change first

      // If dishOrSetType changes, reset itemId and subTotal for the current detail
      if (field === "dishOrSetType") {
        detail.itemId = 0; 
      }

      // Automatic subtotal calculation when dishOrSetType, itemId, or quantity changes
      if (field === "dishOrSetType" || field === "itemId" || field === "quantity") {
        let price = 0;
        if (detail.dishOrSetType === "dish") {
          const selectedDish = availableDishes.find(dish => dish.dNo === detail.itemId);
          if (selectedDish) {
            price = selectedDish.dPrice;
          }
        } else if (detail.dishOrSetType === "set") {
          const selectedSetMeal = availableSetMeals.find(set => set.sNo === detail.itemId);
          if (selectedSetMeal) {
            price = selectedSetMeal.sPrice;
          }
        }
        // Ensure quantity is positive, default to 0 if not (or handle error)
        const currentQuantity = detail.quantity > 0 ? detail.quantity : 0; 
        detail.subTotal = price * currentQuantity;
      }
      
      updated[idx] = detail;
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 簡單驗證
    if (!customerId) {
      alert("請輸入顧客編號 (customerId)");
      return;
    }
    if (!tableId) {
      alert("請輸入餐桌編號 (tableId)");
      return;
    }
    if (details.length === 0) {
      alert("請至少新增一筆訂單明細");
      return;
    }
    // 所有明細必填
    for (const d of details) {
      if (!d.itemId || d.quantity <= 0 ) { // subTotal < 0 check removed as it's auto-calculated
        alert("訂單明細有欄位未填或數值錯誤（品項或數量）");
        return;
      }
    }

    onSubmit({
      oDateTime,
      totalPrice,
      payStatus,
      customerId,
      tableId,
      orderDetailses: details,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "編輯訂單" : "新增訂單"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* oDateTime */}
        <div>
          <label htmlFor="oDateTime" className="block mb-1">
            訂單日期時間 (oDateTime)*
          </label>
          <input
            id="oDateTime"
            type="datetime-local"
            value={oDateTime}
            onChange={(e) => setODateTime(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        {/* payStatus */}
        <div>
          <label htmlFor="payStatus" className="block mb-1">
            付款狀態 (payStatus)*
          </label>
          <select
            id="payStatus"
            value={payStatus}
            onChange={(e) => setPayStatus(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          >
            <option value="未付款">未付款</option>
            <option value="已付款">已付款</option>
            <option value="取消">取消</option>
          </select>
        </div>

        {/* customerId */}
        <div>
          <label htmlFor="customerId" className="block mb-1">
            顧客名稱 (customerId)* 
          </label>
          <select
            id="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(+e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          >
            <option value={0} disabled>
              請選擇顧客
            </option>
            {availableCustomers.map((customer) => (
              <option key={customer.cId} value={customer.cId}>
                {customer.cName} (ID: {customer.cId})
              </option>
            ))}
          </select>
        </div>

        {/* tableId */}
        <div>
          <label htmlFor="tableId" className="block mb-1">
            餐桌編號 (tableId)*
          </label>
          <select
            id="tableId"
            value={tableId}
            onChange={(e) => setTableId(+e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          >
            <option value={0} disabled>
              請選擇餐桌
            </option>
            {availableTables.map((table) => (
              <option key={table.tId} value={table.tId}>
                {table.location} (ID: {table.tId}) 
              </option>
            ))}
          </select>
        </div>

        {/* 訂單明細列表 */}
        <div>
          <h3 className="text-lg font-medium mb-2">訂單明細</h3>
          <button
            type="button"
            onClick={handleAddDetail}
            className="mb-2 px-4 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            + 新增明細
          </button>

          {details.map((d, idx) => (
            <div
              key={`${d.dishOrSetType}-${d.itemId}-${idx}`}
              className="border p-2 mb-2 rounded space-y-2 bg-gray-50"
            >
              <div className="flex justify-between items-center">
                <p>明細 #{idx + 1}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveDetail(idx)}
                  className="text-red-600 hover:underline"
                >
                  刪除
                </button>
              </div>

              {/* dishOrSetType */}
              <div>
                <label
                  htmlFor={`dishOrSetType-${idx}`}
                  className="block mb-1"
                >
                  類別 (dishOrSetType)*
                </label>
                <select
                  id={`dishOrSetType-${idx}`}
                  value={d.dishOrSetType}
                  onChange={(e) =>
                    handleChangeDetail(
                      idx,
                      "dishOrSetType",
                      e.target.value as "dish" | "set"
                    )
                  }
                  className="w-full border px-2 py-1 rounded"
                  required
                >
                  <option value="dish">單點 (dish)</option>
                  <option value="set">套餐 (set)</option>
                </select>
              </div>

              {/* itemId */}
              <div className="flex-1">
                <label className="block mb-1 text-sm">項目編號 (itemId)*</label>
                <select
                  value={d.itemId}
                  onChange={(e) =>
                    handleChangeDetail(idx, "itemId", +e.target.value)
                  }
                  className="w-full border px-2 py-1 rounded"
                  required
                >
                  <option value={0} disabled>
                    {d.dishOrSetType === "dish" ? "選擇單點" : "選擇套餐"}
                  </option>
                  {d.dishOrSetType === "dish" &&
                    availableDishes.map((dish) => (
                      <option key={dish.dNo} value={dish.dNo}>
                        {dish.dName} (ID: {dish.dNo}) - ${dish.dPrice}
                      </option>
                    ))}
                  {d.dishOrSetType === "set" &&
                    availableSetMeals.map((setMeal) => (
                      <option key={setMeal.sNo} value={setMeal.sNo}>
                        {setMeal.sName} (ID: {setMeal.sNo}) - ${setMeal.sPrice}
                      </option>
                    ))}
                </select>
              </div>

              {/* quantity */}
              <div>
                <label htmlFor={`quantity-${idx}`} className="block mb-1">數量 (quantity)*</label>
                <input
                  id={`quantity-${idx}`}
                  type="number"
                  min={1}
                  value={d.quantity}
                  onChange={(e) =>
                    handleChangeDetail(idx, "quantity", +e.target.value)
                  }
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>

              {/* subTotal */}
              <div>
                <label htmlFor={`subTotal-${idx}`} className="block mb-1">小計 (subTotal)*</label>
                <input
                  id={`subTotal-${idx}`}
                  type="number"
                  min={0}
                  step="0.01"
                  value={d.subTotal}
                  className="w-full border px-2 py-1 rounded bg-gray-100"
                  required
                  readOnly
                />
              </div>
            </div>
          ))}

          {details.length === 0 && (
            <p className="text-gray-500">目前尚無訂單明細。</p>
          )}
        </div>

        {/* 按鈕 */}
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {initialData ? "更新" : "建立"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm;
