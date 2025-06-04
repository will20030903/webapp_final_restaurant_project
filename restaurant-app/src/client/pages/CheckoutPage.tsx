// src/client/pages/CheckoutPage.tsx
import React, { useEffect, useState } from "react";
import { useCart } from "../CartContext";
import { fetchAllCustomers, createCustomer } from "../../api/customerService";
import { fetchAllTables } from "../../api/tableService";
import type { Customer } from "../../models/Customer";
import type { TableInfo } from "../../models/TableInfo";
import { useNavigate } from "react-router-dom";
import { formatDateToGMT8_YYYYMMDDTHHMM } from "../../utils/dateTimeUtils";

const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCart();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [cName, setCName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<number | "">("");
  const [selectedTable, setSelectedTable] = useState<number | "">("");
  const [totalAmount, setTotalAmount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // 計算總金額
    const sum = items.reduce((s, ci) => {
      const price = ci.type === "dish" ? ci.item.dPrice : ci.item.sPrice;
      return s + price * ci.quantity;
    }, 0);
    setTotalAmount(sum);

    // 載入現有顧客與餐桌
    loadCustomers();
    loadTables();
  }, [items]);

  async function loadCustomers() {
    try {
      const arr = await fetchAllCustomers();
      setCustomers(arr);
    } catch (err) {
      console.error(err);
    }
  }

  async function loadTables() {
    try {
      const arr = await fetchAllTables();
      setTables(arr);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    let customerUri: string;

    // 如果沒選現有顧客，就建立新顧客（不傳入 cId）
    if (selectedCustomer === "") {
      if (!cName.trim() || !cPhone.trim()) {
        alert("請填寫姓名和電話，或直接從下拉選擇已有顧客");
        return;
      }
      try {
        const newC = await createCustomer({ cName, cPhone });
        customerUri = `/api/customers/${newC.cId}`;
      } catch (err) {
        console.error(err);
        return;
      }
    } else {
      customerUri = `/api/customers/${selectedCustomer}`;
    }

    if (!selectedTable) {
      alert("請選擇餐桌");
      return;
    }
    const tableUri = `/api/tables/${selectedTable}`;

    // 組成後端原始需要的訂單主檔 payload（不含 oId、自主鍵）
    const orderPayload = {
      oDateTime: formatDateToGMT8_YYYYMMDDTHHMM(new Date()),
      totalPrice: totalAmount,
      payStatus: "未付款",
      customer: customerUri,
      tableInfo: tableUri,
      // 如果要同時傳 orderDetailses，請改成：
      // orderDetails: items.map(ci => {
      //   if (ci.type === "dish") {
      //     return {
      //       dish: `/api/dishes/${ci.item.dNo}`,
      //       setMeal: null,
      //       quantity: ci.quantity,
      //       subTotal: ci.item.dPrice * ci.quantity
      //     };
      //   } else {
      //     return {
      //       dish: null,
      //       setMeal: `/api/sets/${ci.item.sNo}`,
      //       quantity: ci.quantity,
      //       subTotal: ci.item.sPrice * ci.quantity
      //     };
      //   }
      // })
    };

    try {
      const res = await fetch("http://163.25.107.227:8081/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });
      if (!res.ok) {
        throw new Error(`建立訂單失敗，HTTP 狀態：${res.status}`);
      }
      clearCart();
      alert("下單成功！");
      navigate("/client/menu");
    } catch (err) {
      console.error(err);
      alert("下單失敗，請稍後重試");
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">結帳頁</h2>
      {items.length === 0 ? (
        <p>
          <span>購物車為空，無法結帳。</span>
          <button
            onClick={() => navigate("/client/menu")}
            className="text-blue-500 hover:underline ml-2"
          >
            返回菜單
          </button>
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 選擇現有顧客 */}
          <div>
            <label htmlFor="existingCustomer" className="block mb-1">
              選擇現有顧客（若沒有可先填姓名電話）
            </label>
            <select
              id="existingCustomer"
              value={selectedCustomer}
              onChange={(e) =>
                setSelectedCustomer(
                  e.target.value === "" ? "" : +e.target.value
                )
              }
              className="w-full border px-2 py-1 rounded"
            >
              <option value="">— 無 —</option>
              {customers.map((c) => (
                <option key={c.cId} value={c.cId}>
                  {c.cName} ({c.cPhone})
                </option>
              ))}
            </select>
          </div>

          {/* 如果沒選現有顧客，就顯示新增顧客欄位 */}
          {selectedCustomer === "" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="cName" className="block mb-1">
                  姓名*
                </label>
                <input
                  id="cName"
                  type="text"
                  value={cName}
                  onChange={(e) => setCName(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
              <div>
                <label htmlFor="cPhone" className="block mb-1">
                  電話*
                </label>
                <input
                  id="cPhone"
                  type="text"
                  value={cPhone}
                  onChange={(e) => setCPhone(e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                  required
                />
              </div>
            </div>
          )}

          {/* 選擇餐桌（不允許輸入 tId） */}
          <div>
            <label htmlFor="tableSelect" className="block mb-1">
              選擇餐桌*
            </label>
            <select
              id="tableSelect"
              value={selectedTable}
              onChange={(e) => setSelectedTable(+e.target.value)}
              className="w-full border px-2 py-1 rounded"
              required
            >
              <option value="">請選擇餐桌</option>
              {tables.map((t) => (
                <option key={t.tId} value={t.tId}>
                  T{t.tId} (容納 {t.capacity} 人) — {t.location}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center mt-6">
            <p className="text-xl">
              總金額：
              <span className="font-bold ml-2">NT$ {totalAmount}</span>
            </p>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => navigate("/client/cart")}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              返回購物車
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              確認結帳
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CheckoutPage;
