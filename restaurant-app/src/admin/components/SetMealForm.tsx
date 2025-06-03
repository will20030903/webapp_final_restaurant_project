// src/admin/components/SetMealForm.tsx
import React, { useState, useEffect } from "react";
import type { SetMeal } from "../../models/SetMeal";

interface Props {
  initialData: SetMeal | null;
  onCancel: () => void;
  /**
   * onSubmit 只接收後端需要的欄位：{ sName, sDesc, sPrice }
   */
  onSubmit: (data: {
    sName: string;
    sDesc: string;
    sPrice: number;
  }) => void;
}

const SetMealForm: React.FC<Props> = ({ initialData, onCancel, onSubmit }) => {
  const [sName, setSName] = useState<string>(initialData?.sName ?? "");
  const [sDesc, setSDesc] = useState<string>(initialData?.sDesc ?? "");
  const [sPrice, setSPrice] = useState<number>(initialData?.sPrice ?? 0);

  useEffect(() => {
    if (initialData) {
      setSName(initialData.sName);
      setSDesc(initialData.sDesc ?? "");
      setSPrice(initialData.sPrice);
    } else {
      setSName("");
      setSDesc("");
      setSPrice(0);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sName.trim()) {
      alert("請填寫套餐名稱 (sName)");
      return;
    }
    if (sPrice <= 0) {
      alert("請填寫大於 0 的價格 (sPrice)");
      return;
    }
    onSubmit({
      sName: sName.trim(),
      sDesc: sDesc.trim(),
      sPrice,
    });
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "編輯套餐" : "新增套餐"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* sName */}
        <div>
          <label htmlFor="sName" className="block mb-1">
            套餐名稱 (sName)*
          </label>
          <input
            id="sName"
            type="text"
            value={sName}
            onChange={(e) => setSName(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            placeholder="請輸入套餐名稱"
            required
          />
        </div>

        {/* sDesc */}
        <div>
          <label htmlFor="sDesc" className="block mb-1">
            套餐敘述 (sDesc)
          </label>
          <textarea
            id="sDesc"
            value={sDesc}
            onChange={(e) => setSDesc(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            placeholder="請輸入套餐敘述（選填）"
            rows={3}
          />
        </div>

        {/* sPrice */}
        <div>
          <label htmlFor="sPrice" className="block mb-1">
            價格 (sPrice)*
          </label>
          <input
            id="sPrice"
            type="number"
            min={1}
            value={sPrice}
            onChange={(e) => setSPrice(+e.target.value)}
            className="w-full border px-2 py-1 rounded"
            placeholder="請輸入價格"
            required
          />
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

export default SetMealForm;
