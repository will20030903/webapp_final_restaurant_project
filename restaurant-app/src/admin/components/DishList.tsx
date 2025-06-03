// src/admin/components/DishList.tsx
import React from "react";
import type { Dish } from "../../models/Dish";

interface Props {
  dishes: Dish[];
  onEdit: (dish: Dish) => void;
  onDelete: (dNo: number) => void;
}

const DishList: React.FC<Props> = ({ dishes, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white border">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2 border">序號</th>
          <th className="px-4 py-2 border">名稱</th>
          <th className="px-4 py-2 border">敘述</th>
          <th className="px-4 py-2 border">價錢</th>
          <th className="px-4 py-2 border">類別</th>
          <th className="px-4 py-2 border">操作</th>
        </tr>
      </thead>
      <tbody>
        {dishes.map((d, index) => (
          <tr key={d.dNo} className="hover:bg-gray-50">
            <td className="px-4 py-2 border text-center">{index + 1}</td>
            <td className="px-4 py-2 border">{d.dName}</td>
            <td className="px-4 py-2 border">{d.dDesc}</td>
            <td className="px-4 py-2 border text-right">NT$ {d.dPrice}</td>
            <td className="px-4 py-2 border">{d.dType}</td>
            <td className="px-4 py-2 border text-center space-x-2">
              <button
                className="text-blue-600 hover:underline"
                onClick={() => onEdit(d)}
              >
                編輯
              </button>
              <button
                className="text-red-600 hover:underline"
                onClick={() => onDelete(d.dNo)}
              >
                刪除
              </button>
            </td>
          </tr>
        ))}

        {dishes.length === 0 && (
          <tr>
            <td colSpan={6} className="px-4 py-2 text-center">
              目前沒有任何單點資料。
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default DishList;
