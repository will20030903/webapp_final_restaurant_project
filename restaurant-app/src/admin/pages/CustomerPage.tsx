// src/admin/pages/CustomerPage.tsx
import React, { useEffect, useState } from "react";
import type { Customer } from "../../models/Customer";
import {
  fetchAllCustomers,
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "../../api/customerService";
import CustomerList from "../components/CustomerList";
import CustomerForm from "../components/CustomerForm";

const CustomerPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const arr = await fetchAllCustomers();
      setCustomers(arr);
    } catch (error) {
      console.error(error);
    }
  }

  function handleOpenCreate() {
    setEditingCustomer(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(c: Customer) {
    setEditingCustomer(c);
    setIsFormOpen(true);
  }

  async function handleDelete(cId: number) {
    if (window.confirm(`確定要刪除顧客 ${cId} 嗎？`)) {
      try {
        await deleteCustomer(cId);
        loadCustomers();
      } catch (error) {
        console.error(error);
      }
    }
  }

  async function handleSubmit(formData: Partial<Customer>) {
    try {
      if (editingCustomer) {
        // 編輯模式：PUT /api/customers/{cId}
        await updateCustomer(editingCustomer.cId, {
          cName: formData.cName!,
          cPhone: formData.cPhone!,
        });
      } else {
        // 新增模式：POST /api/customers，createCustomer 會回傳包含 cId 的完整物件
        const newCust = await createCustomer({
          cName: formData.cName!,
          cPhone: formData.cPhone!,
        });
        console.log("剛建立的顧客 ID：", newCust.cId);
      }
      setIsFormOpen(false);
      loadCustomers();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold font-heading text-text-primary">顧客管理</h1>
        <button
          className="bg-primary hover:bg-opacity-90 text-white px-4 py-2 rounded font-semibold"
          onClick={handleOpenCreate}
        >
          + 新增顧客
        </button>
      </div>

      <CustomerList
        customers={customers}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <CustomerForm
              initialData={editingCustomer}
              onCancel={() => setIsFormOpen(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerPage;
