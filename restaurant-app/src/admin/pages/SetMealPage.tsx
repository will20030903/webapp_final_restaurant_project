// src/admin/pages/SetMealPage.tsx
import React, { useEffect, useState } from "react";
import type { SetMeal } from "../../models/SetMeal";
import {
  fetchAllSetMeals,
  createSetMeal,
  updateSetMeal,
  deleteSetMeal,
} from "../../api/setMealService";
import SetMealList from "../components/SetMealList";
import SetMealForm from "../components/SetMealForm";

const SetMealPage: React.FC = () => {
  const [setMeals, setSetMeals] = useState<SetMeal[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSetMeal, setEditingSetMeal] = useState<SetMeal | null>(null);

  useEffect(() => {
    loadSetMeals();
  }, []);

  async function loadSetMeals() {
    try {
      const arr = await fetchAllSetMeals();
      setSetMeals(arr);
    } catch (error) {
      console.error("讀取套餐失敗：", error);
      // Consider setting an error state here to display to the user
    }
  }

  function handleOpenCreate() {
    setEditingSetMeal(null);
    setIsFormOpen(true);
  }

  function handleOpenEdit(setMeal: SetMeal) {
    setEditingSetMeal(setMeal);
    setIsFormOpen(true);
  }

  async function handleDelete(sNo: number) {
    if (window.confirm(`確定要刪除套餐 ${sNo} 嗎？`)) {
      try {
        await deleteSetMeal(sNo);
        loadSetMeals(); // Refresh list after delete
      } catch (error) {
        console.error("刪除套餐失敗：", error);
        alert((error as Error).message);
      }
    }
  }

  // This is the handleSubmit function for SetMealPage.
  // It receives data from SetMealForm and calls the appropriate API service.
  async function handleSubmit(formData: { sName: string; sDesc: string; sPrice: number; }) {
    try {
      if (editingSetMeal) {
        await updateSetMeal(editingSetMeal.sNo, formData);
      } else {
        await createSetMeal(formData);
      }
      setIsFormOpen(false);
      loadSetMeals(); // Refresh list after create/update
    } catch (error) {
      console.error("儲存套餐失敗：", error);
      alert((error as Error).message);
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">套餐管理</h1>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleOpenCreate}
        >
          + 新增套餐
        </button>
      </div>

      {/* Ensure SetMealList component exists and is correctly imported */}
      <SetMealList sets={setMeals} onEdit={handleOpenEdit} onDelete={handleDelete} />

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg w-1/2 max-h-[90vh] overflow-auto">
            <SetMealForm
              initialData={editingSetMeal}
              onCancel={() => setIsFormOpen(false)}
              onSubmit={handleSubmit} // Pass the page's handleSubmit to the form
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default SetMealPage;
