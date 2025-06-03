// src/admin/pages/OrderPage.tsx
import React, { useEffect, useState } from "react";
import type { OrderInfo } from "../../models/OrderInfo";
import type { Customer } from "../../models/Customer";
import type { TableInfo } from "../../models/TableInfo";
import {
  fetchAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../../api/orderService";
import { fetchAllCustomers } from "../../api/customerService";
import { fetchAllTables } from "../../api/tableService";
import OrderList from "../components/OrderList";
import OrderForm from "../components/OrderForm";
import type { OrderDetailPayload } from "../components/OrderForm";

const OrderPage: React.FC = () => {
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [tables, setTables] = useState<TableInfo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<OrderInfo | null>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      const [ordersData, customersData, tablesData] = await Promise.all([
        fetchAllOrders(),
        fetchAllCustomers(),
        fetchAllTables(),
      ]);
      setOrders(ordersData);
      setCustomers(customersData);
      setTables(tablesData);
    } catch (error) {
      console.error("讀取訂單、顧客或餐桌資料失敗：", error);
    }
  }

  async function loadOrders() {
    try {
      const arr = await fetchAllOrders();
      setOrders(arr);
    } catch (error) {
      console.error("讀取訂單失敗：", error);
    }
  }

  function handleOpenCreate() {
    setEditingOrder(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(o: OrderInfo) {
    setEditingOrder(o);
    setIsFormOpen(true);
  }

  async function handleDelete(oId: number) {
    if (window.confirm(`確定要刪除訂單 ${oId} 嗎？`)) {
      try {
        await deleteOrder(oId);
        loadOrders();
      } catch (error) {
        console.error("刪除訂單失敗：", error);
      }
    }
  }

  /**
   * 這裡 onSubmit 接的是「完整送給後端的 shape」，
   *   data.oDateTime: string
   *   data.totalPrice: number
   *   data.payStatus: string
   *   data.customerId: number
   *   data.tableId: number
   *   data.orderDetailses: OrderDetailPayload[]
   */
  async function handleSubmit(data: {
    oDateTime: string;
    totalPrice: number;
    payStatus: string;
    customerId: number;
    tableId: number;
    orderDetailses: OrderDetailPayload[];
  }) {
    try {
      if (editingOrder) {
        await updateOrder(editingOrder.oId, data);
      } else {
        const createOrderPayload = {
          oDateTime: data.oDateTime,
          payStatus: data.payStatus,
          customerId: data.customerId,
          tableId: data.tableId,
          totalPrice: data.totalPrice,
          orderDetailses: data.orderDetailses.map(detail => ({
            dishOrSetType: detail.dishOrSetType,
            itemId: detail.itemId,
            quantity: detail.quantity,
            subTotal: detail.subTotal,
          })),
        };
        await createOrder(createOrderPayload);
      }
      setIsFormOpen(false);
      loadOrders();
    } catch (error) {
      console.error("儲存訂單失敗：", error);
      alert((error as Error).message);
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">訂單管理</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleOpenCreate}
        >
          + 新增訂單
        </button>
      </div>

      <OrderList orders={orders} customers={customers} tables={tables} onEdit={handleOpenEdit} onDelete={handleDelete} />

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-3/5 max-h-[90vh] overflow-auto">
            <OrderForm
              initialData={editingOrder}
              onCancel={() => setIsFormOpen(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
