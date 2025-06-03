// src/admin/components/OrderList.tsx
import React from "react";
import type { OrderInfo } from "../../models/OrderInfo";
import type { Customer } from "../../models/Customer";
import type { TableInfo } from "../../models/TableInfo";

interface Props {
  orders: OrderInfo[];
  customers: Customer[];
  tables: TableInfo[];
  onEdit: (order: OrderInfo) => void;
  onDelete: (oId: number) => void;
}

const OrderList: React.FC<Props> = ({ orders, customers, tables, onEdit, onDelete }) => {
  const getCustomerName = (customerId?: number) => {
    if (!customerId) return "-";
    const customer = customers.find((c) => c.cId === customerId);
    return customer ? customer.cName : "未知顧客";
  };

  const getTableLocation = (tableId?: number) => {
    if (!tableId) return "-";
    const table = tables.find((t) => t.tId === tableId);
    return table ? table.location : "未知餐桌";
  };

  return (
    <table className="min-w-full bg-white border">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2 border">序號</th>
          <th className="px-4 py-2 border">日期時間</th>
          <th className="px-4 py-2 border">總金額</th>
          <th className="px-4 py-2 border">付款狀態</th>
          <th className="px-4 py-2 border">顧客名稱</th>
          <th className="px-4 py-2 border">餐桌位置</th>
          <th className="px-4 py-2 border">操作</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o, index) => (
          <tr key={o.oId} className="hover:bg-gray-50">
            <td className="px-4 py-2 border text-center">{index + 1}</td>
            <td className="px-4 py-2 border">
              {new Date(o.oDateTime).toLocaleString()}
            </td>
            <td className="px-4 py-2 border text-right">NT$ {o.totalPrice}</td>
            <td className="px-4 py-2 border">{o.payStatus}</td>
            <td className="px-4 py-2 border text-center">
              {getCustomerName(o.customerId)}
            </td>
            <td className="px-4 py-2 border text-center">
              {getTableLocation(o.tableId)}
            </td>
            <td className="px-4 py-2 border text-center space-x-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => onEdit(o)}
              >
                編輯
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => onDelete(o.oId)}
              >
                刪除
              </button>
            </td>
          </tr>
        ))}

        {orders.length === 0 && (
          <tr>
            <td colSpan={7} className="px-4 py-2 text-center">
              目前沒有任何訂單資料。
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default OrderList;
