// src/admin/components/SetMealList.tsx
import React from "react";
import type { SetMeal } from "../../models/SetMeal";

interface Props {
  sets: SetMeal[];
  onEdit: (setMeal: SetMeal) => void;
  onDelete: (sNo: number) => void;
}

const SetMealList: React.FC<Props> = ({ sets, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white border">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2 border">序號</th>
          <th className="px-4 py-2 border">名稱</th>
          <th className="px-4 py-2 border">敘述</th>
          <th className="px-4 py-2 border">價錢</th>
          <th className="px-4 py-2 border">操作</th>
        </tr>
      </thead>
      <tbody>
        {sets.map((s, index) => (
          <tr key={s.sNo} className="hover:bg-gray-50">
            <td className="px-4 py-2 border text-center">{index + 1}</td>
            <td className="px-4 py-2 border">{s.sName}</td>
            <td className="px-4 py-2 border">{s.sDesc}</td>
            <td className="px-4 py-2 border text-right">NT$ {s.sPrice}</td>
            <td className="px-4 py-2 border text-center space-x-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => onEdit(s)}
              >
                編輯
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => onDelete(s.sNo)}
              >
                刪除
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default SetMealList;
