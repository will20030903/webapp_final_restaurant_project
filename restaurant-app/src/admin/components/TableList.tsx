// src/admin/components/TableList.tsx
import React from "react";
import type { TableInfo } from "../../models/TableInfo";

interface Props {
  tables: TableInfo[];
  onEdit: (t: TableInfo) => void;
  onDelete: (tId: number) => void;
}

const TableList: React.FC<Props> = ({ tables, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white border">
      <thead>
        <tr className="bg-gray-200">
          <th className="px-4 py-2 border">序號</th>
          <th className="px-4 py-2 border">容納人數</th>
          <th className="px-4 py-2 border">位置</th>
          <th className="px-4 py-2 border">操作</th>
        </tr>
      </thead>
      <tbody>
        {tables.map((t, index) => (
          // 這裡必須 key={t.tId}，確保每列都有唯一 key
          <tr key={t.tId} className="hover:bg-gray-50">
            <td className="px-4 py-2 border text-center">{index + 1}</td>
            <td className="px-4 py-2 border text-center">{t.capacity}</td>
            <td className="px-4 py-2 border">{t.location}</td>
            <td className="px-4 py-2 border text-center space-x-2">
              <button
                onClick={() => onEdit(t)}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                編輯
              </button>
              <button
                onClick={() => onDelete(t.tId)}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                刪除
              </button>
            </td>
          </tr>
        ))}
        {tables.length === 0 && (
          <tr>
            <td colSpan={4} className="px-4 py-2 text-center">
              目前沒有任何餐桌。
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default TableList;
