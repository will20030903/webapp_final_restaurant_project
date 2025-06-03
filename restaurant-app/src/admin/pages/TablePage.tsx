// src/admin/pages/TablePage.tsx
import React, { useEffect, useState } from "react";
import type { TableInfo } from "../../models/TableInfo";
import {
  fetchAllTables,
  createTable,
  deleteTable,
  updateTable,
} from "../../api/tableService";
import TableList from "../components/TableList";
import TableForm from "../components/TableForm";

const TablePage: React.FC = () => {
  // 存放從後端撈到的餐桌列表
  const [tables, setTables] = useState<TableInfo[]>([]);

  // 控制「是否顯示表單 Modal」
  const [isFormOpen, setIsFormOpen] = useState(false);

  // 如果要編輯某一筆餐桌，就把該筆資料放到 editingTable
  // 新增的時候 editingTable = null
  const [editingTable, setEditingTable] = useState<TableInfo | null>(null);

  // -------------------------------------------------------
  // 這段 useEffect 只會在 component 一開始掛載時執行一次：
  // 因此，每次使用者「刷新整個瀏覽器（F5）」或第一次開到 /admin/tables 時
  // 就會呼叫 loadTables() 從後端取最新資料
  // -------------------------------------------------------
  useEffect(() => {
    loadTables();
  }, []); // 空陣列代表「只在初次 mount 時觸發」

  // -------------------------------------------------------
  // loadTables 負責向後端撈所有餐桌，並更新到 state
  // -------------------------------------------------------
  async function loadTables() {
    try {
      const arr = await fetchAllTables();
      setTables(arr);
    } catch (error) {
      console.error("撈取餐桌列表失敗：", error);
    }
  }

  // 叫出 Modal 並且把 editingTable 設為 null → 代表「新增餐桌」
  function handleOpenCreate() {
    setEditingTable(null);
    setIsFormOpen(true);
  }

  // 叫出 Modal 並且把 editingTable 設為該筆資料 → 代表「編輯餐桌」
  function handleOpenEdit(t: TableInfo) {
    setEditingTable(t);
    setIsFormOpen(true);
  }

  // 刪除某一筆餐桌
  async function handleDelete(tId: number) {
    if (window.confirm(`確定要刪除餐桌 ${tId} 嗎？`)) {
      try {
        await deleteTable(tId);
        // 呼叫 loadTables() 重新向後端撈最新列表
        loadTables();
      } catch (error) {
        console.error(`刪除餐桌 ${tId} 失敗：`, error);
      }
    }
  }

  // 表單送出時呼叫：如果 editingTable 有值就是「編輯」，否則就是「新增」
  async function handleSubmit(formData: {
    capacity: number;
    location: string;
  }) {
    try {
      if (editingTable) {
        // 編輯模式：PUT /api/tables/{tId}
        await updateTable(editingTable.tId, {
          capacity: formData.capacity,
          location: formData.location,
        });
      } else {
        // 新增模式：POST /api/tables
        const newT = await createTable({
          capacity: formData.capacity,
          location: formData.location,
        });
        console.log("剛建立的餐桌 ID：", newT.tId);
      }
      // 不論新增或編輯都先關閉 Modal，再重新撈取一次最新列表
      setIsFormOpen(false);
      loadTables();
    } catch (error) {
      console.error("儲存餐桌資料時發生錯誤：", error);
    }
  }

  return (
    <div className="p-4">
      {/* 標題 + 新增按鈕 */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">餐桌管理</h1>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          + 新增餐桌
        </button>
      </div>

      {/* 列表元件，傳入 tables, onEdit, onDelete */}
      <TableList
        tables={tables}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
      />

      {/* Modal：isFormOpen=true 才顯示 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[90vh] overflow-auto">
            <TableForm
              initialData={editingTable}
              onCancel={() => setIsFormOpen(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TablePage;
