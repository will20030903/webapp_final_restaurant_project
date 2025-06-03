// src/admin/components/TableForm.tsx
import React, { useState, useEffect } from "react";
import type { TableInfo } from "../../models/TableInfo";

interface Props {
  initialData: TableInfo | null; // null 代表「新增」，有物件代表「編輯」
  onCancel: () => void;
  onSubmit: (data: { capacity: number; location: string }) => void;
}

const TableForm: React.FC<Props> = ({ initialData, onCancel, onSubmit }) => {
  const [capacity, setCapacity] = useState(initialData?.capacity ?? 1);
  const [location, setLocation] = useState(initialData?.location ?? "");

  // 當 initialData 變動（從 null→物件 或 物件→null）時，更新 local state
  useEffect(() => {
    if (initialData) {
      setCapacity(initialData.capacity);
      setLocation(initialData.location);
    } else {
      setCapacity(1);
      setLocation("");
    }
  }, [initialData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!location.trim()) {
      alert("請填寫位置");
      return;
    }
    onSubmit({ capacity, location: location.trim() });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "編輯餐桌" : "新增餐桌"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {initialData && (
          <div>
            <label htmlFor="table-id" className="block mb-1">餐桌編號 (ID，唯讀)</label>
            <input
              id="table-id"
              type="text"
              value={initialData.tId}
              disabled
              className="w-full bg-gray-100 border px-2 py-1 rounded"
            />
          </div>
        )}

        <div>
          <label htmlFor="capacity" className="block mb-1">
            容納人數 (capacity)*
          </label>
          <input
            id="capacity"
            type="number"
            min={1}
            value={capacity}
            onChange={(e) => setCapacity(Math.max(1, +e.target.value))}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

        <div>
          <label htmlFor="location" className="block mb-1">
            位置 (location)*
          </label>
          <input
            id="location"
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          />
        </div>

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
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {initialData ? "更新" : "建立"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TableForm;
