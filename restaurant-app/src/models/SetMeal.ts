// src/models/SetMeal.ts
export interface SetMeal {
  sNo: number;       // 套餐編號
  sName: string;     // 套餐名稱
  sDesc?: string;    // 套餐敘述（可選）
  sPrice: number;    // 價錢
}
