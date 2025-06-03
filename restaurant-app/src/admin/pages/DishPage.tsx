import React, { useEffect, useState } from "react";
import type { Dish } from "../../models/Dish";
import {
  fetchAllDishes,
  createDish,
  updateDish,
  deleteDish,
} from "../../api/dishService";
import DishList from "../components/DishList";
import DishForm from "../components/DishForm";

const DishPage: React.FC = () => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDish, setEditingDish] = useState<Dish | null>(null);

  useEffect(() => {
    loadDishes();
  }, []);

  async function loadDishes() {
    try {
      const arr = await fetchAllDishes();
      setDishes(arr);
    } catch (error) {
      console.error("讀取單點列表失敗：", error);
    }
  }

  function handleOpenCreate() {
    setEditingDish(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(d: Dish) {
    setEditingDish(d);
    setIsFormOpen(true);
  }

  async function handleDelete(dNo: number) {
    if (window.confirm(`確定要刪除單點 ${dNo} 嗎？`)) {
      try {
        await deleteDish(dNo);
        loadDishes();
      } catch (error) {
        console.error(`刪除單點 ${dNo} 失敗：`, error);
      }
    }
  }

  /**
   * formData 只包含：「dName、dDesc、dPrice、dType」
   */
  async function handleSubmit(formData: {
    dName: string;
    dDesc: string;
    dPrice: number;
    dType: string;
  }) {
    try {
      if (editingDish) {
        // 編輯模式：PUT /api/dishes/{dNo}
        await updateDish(editingDish.dNo, {
          dName: formData.dName,
          dDesc: formData.dDesc,
          dPrice: formData.dPrice,
          dType: formData.dType,
        });
      } else {
        // 新增模式：POST /api/dishes
        await createDish({
          dName: formData.dName,
          dDesc: formData.dDesc,
          dPrice: formData.dPrice,
          dType: formData.dType,
        });
      }
      setIsFormOpen(false);
      loadDishes();
    } catch (error) {
      console.error("儲存單點失敗：", error);
      alert((error as Error).message);
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">單點管理</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleOpenCreate}
        >
          + 新增單點
        </button>
      </div>

      {/* 列表 Table */}
      <DishList dishes={dishes} onEdit={handleOpenEdit} onDelete={handleDelete} />

      {/* 彈出表單：新增/編輯 */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[90vh] overflow-auto">
            <DishForm
              initialData={editingDish}
              onCancel={() => setIsFormOpen(false)}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DishPage;
