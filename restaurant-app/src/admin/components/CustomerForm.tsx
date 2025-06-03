// src/admin/components/CustomerForm.tsx
import React, { useState, useEffect } from "react";
import type { Customer } from "../../models/Customer";

interface Props {
  initialData: Customer | null;
  onCancel: () => void;
  onSubmit: (data: Partial<Customer>) => void;
}

const CustomerForm: React.FC<Props> = ({ initialData, onCancel, onSubmit }) => {
  const [cName, setCName] = useState(initialData?.cName ?? "");
  const [cPhone, setCPhone] = useState(initialData?.cPhone ?? "");

  useEffect(() => {
    if (initialData) {
      setCName(initialData.cName);
      setCPhone(initialData.cPhone);
    }
  }, [initialData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!cName || !cPhone) {
      alert("請填寫姓名與電話");
      return;
    }
    const payload: Partial<Customer> = {
      cName,
      cPhone,
    };
    onSubmit(payload);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "編輯顧客" : "新增顧客"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="cName" className="block mb-1 text-text-secondary font-semibold">姓名 (cName)*</label>
          <input
            id="cName"
            type="text"
            value={cName}
            onChange={(e) => setCName(e.target.value)}
            className="w-full border border-border-color px-3 py-2 rounded focus:ring-primary focus:border-primary shadow-sm"
            required
          />
        </div>

        <div>
          <label htmlFor="cPhone" className="block mb-1 text-text-secondary font-semibold">電話 (cPhone)*</label>
          <input
            id="cPhone"
            type="text"
            value={cPhone}
            onChange={(e) => setCPhone(e.target.value)}
            className="w-full border border-border-color px-3 py-2 rounded focus:ring-primary focus:border-primary shadow-sm"
            required
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="px-4 py-2 bg-gray-200 text-text-secondary rounded font-semibold hover:bg-gray-300"
            onClick={onCancel}
          >
            取消
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded font-semibold hover:bg-opacity-90"
          >
            {initialData ? "更新" : "建立"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
