// src/admin/components/CustomerList.tsx
import React from "react";
import type { Customer } from "../../models/Customer";

interface Props {
  customers: Customer[];
  onEdit: (c: Customer) => void;
  onDelete: (cId: number) => void;
}

const CustomerList: React.FC<Props> = ({ customers, onEdit, onDelete }) => {
  return (
    <table className="min-w-full bg-white border border-border-color">
      <thead>
        <tr className="bg-background-light text-text-primary font-semibold">
          <th className="px-4 py-2 border border-border-color">序號</th>
          <th className="px-4 py-2 border border-border-color">姓名</th>
          <th className="px-4 py-2 border border-border-color">電話</th>
          <th className="px-4 py-2 border border-border-color">操作</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((c, index) => (
          // 這裡務必把 c.cId 作為 key，確保每列都有獨一無二的 key
          <tr key={c.cId} className="hover:bg-gray-100">
            <td className="px-4 py-2 border border-border-color text-center">{index + 1}</td>
            <td className="px-4 py-2 border border-border-color">{c.cName}</td>
            <td className="px-4 py-2 border border-border-color">{c.cPhone}</td>
            <td className="px-4 py-2 border border-border-color text-center">
              <button
                onClick={() => onDelete(c.cId)}
                className="px-2 py-1 bg-error text-white rounded hover:bg-opacity-90 font-semibold"
              >
                刪除
              </button>
              <button
                onClick={() => onEdit(c)}
                className="ml-2 px-2 py-1 bg-secondary text-white rounded hover:bg-opacity-90 font-semibold"
              >
                編輯
              </button>
            </td>
          </tr>
        ))}

        {/* 如果顧客陣列為空，就顯示這一列提示文字，這段不在 map 裡，所以不需要 key */}
        {customers.length === 0 && (
          <tr>
            <td colSpan={4} className="px-4 py-2 text-center">
              目前沒有任何顧客。
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default CustomerList;
