// src/models/Dish.ts
export interface Dish {
  dNo: number;       // 單點編號
  dName: string;     // 單點名稱
  dDesc?: string;    // 單點敘述（可選）
  dPrice: number;    // 價錢
  dType: string;     // 類別
}
