// src/admin/components/DishForm.tsx
import React, { useState, useEffect } from "react";
import type { Dish } from "../../models/Dish";

interface Props {
  /**
   * initialData = null → 新增模式
   * initialData = Dish → 編輯模式，帶入欄位預設值
   */
  initialData: Dish | null;
  onCancel: () => void;
  /**
   * onSubmit 只接收必須送後端的四個欄位：dName/dDesc/dPrice/dType，
   * 編輯時從 editingDish 拿 dNo 送到 updateDish，不需要從這裡再帶 dNo
   */
  onSubmit: (data: {
    dName: string;
    dDesc: string;
    dPrice: number;
    dType: string;
  }) => void;
}

const DishForm: React.FC<Props> = ({ initialData, onCancel, onSubmit }) => {
  // 不再有 dNo 這個 state；只在編輯模式下顯示，但不允許修改
  const [dName, setDName] = useState(initialData?.dName ?? "");
  // 這裡用 (initialData?.dDesc ?? "")，避免 dDesc 可能為 undefined
  const [dDesc, setDDesc] = useState<string>(initialData?.dDesc ?? "");
  const [dPrice, setDPrice] = useState<number>(initialData?.dPrice ?? 0);
  const [dType, setDType] = useState(initialData?.dType ?? "");

  useEffect(() => {
    if (initialData) {
      setDName(initialData.dName);
      // 同樣改用 initialData.dDesc ?? ""
      setDDesc(initialData.dDesc ?? "");
      setDPrice(initialData.dPrice);
      setDType(initialData.dType);
    } else {
      setDName("");
      setDDesc("");
      setDPrice(0);
      setDType("");
    }
  }, [initialData]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // 欄位簡單驗證
    if (!dName.trim()) {
      alert("請填寫單點名稱 (dName)");
      return;
    }
    if (dPrice <= 0) {
      alert("請填寫大於 0 的價錢 (dPrice)");
      return;
    }
    if (!dType.trim()) {
      alert("請選擇類別 (dType)");
      return;
    }

    onSubmit({
      dName: dName.trim(),
      dDesc: dDesc.trim(),
      dPrice,
      dType: dType.trim(),
    });
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">
        {initialData ? "編輯單點" : "新增單點"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 編輯模式：顯示一個唯讀欄位用來查看 dNo，但不允許修改 */}
        {initialData && (
          <div>
            <label htmlFor="dNo" className="block mb-1">單點編號 (dNo)（唯讀）</label>
            <input
              id="dNo"
              type="text"
              value={initialData.dNo}
              disabled
              className="w-full bg-gray-100 border px-2 py-1 rounded"
            />
          </div>
        )}

        <div>
          <label htmlFor="dName" className="block mb-1">
            單點名稱 (dName)*
          </label>
          <input
            id="dName"
            type="text"
            value={dName}
            onChange={(e) => setDName(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            placeholder="請輸入單點名稱"
            required
          />
        </div>

        <div>
          <label htmlFor="dDesc" className="block mb-1">
            單點敘述 (dDesc)
          </label>
          <textarea
            id="dDesc"
            value={dDesc}
            onChange={(e) => setDDesc(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            placeholder="請輸入敘述（選填）"
            rows={3}
          />
        </div>

        <div>
          <label htmlFor="dPrice" className="block mb-1">
            價錢 (dPrice)*
          </label>
          <input
            id="dPrice"
            type="number"
            min={1}
            value={dPrice}
            onChange={(e) => setDPrice(+e.target.value)}
            className="w-full border px-2 py-1 rounded"
            placeholder="請輸入價錢"
            required
          />
        </div>

        <div>
          <label htmlFor="dType" className="block mb-1">
            類別 (dType)*
          </label>
          <select
            id="dType"
            value={dType}
            onChange={(e) => setDType(e.target.value)}
            className="w-full border px-2 py-1 rounded"
            required
          >
            <option value="">請選擇</option>
            <option value="主餐">主餐</option>
            <option value="湯品">湯品</option>
            <option value="飲料">飲料</option>
            <option value="甜點">甜點</option>
            <option value="小吃">小吃</option>
            {/* 如果有其他類別，請加上 */}
          </select>
        </div>

        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            onClick={onCancel}
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

export default DishForm;
