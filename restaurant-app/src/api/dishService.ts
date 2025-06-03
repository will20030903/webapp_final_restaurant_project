// src/api/dishService.ts
import type { Dish } from "../models/Dish";
import type { RawDish, RawDishResponse } from "../models/RawDishResponse";

const BASE_URL = "http://163.25.107.227:8081/api/dishes";

/**
 * 取得所有單點 (GET /api/dishes)
 */
export async function fetchAllDishes(): Promise<Dish[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`無法讀取所有單點，HTTP 狀態：${res.status}`);
  }

  // 用 RawDishResponse 來解析 JSON
  const body: RawDishResponse = await res.json();

  // 從 _embedded.dishes 裡取 RawDish[]
  const rawArr: RawDish[] = body._embedded?.dishes ?? [];
  console.log("【DEBUG】fetchAllDishes 拿到 rawArr：", rawArr);

  // 將每一筆 RawDish 轉成前端要用的 Dish
  const dishList: Dish[] = rawArr.map((raw) => ({
    dNo: raw.dNo,      // 直接用 raw.dNo
    dName: raw.dName,
    dDesc: raw.dDesc,
    dPrice: raw.dPrice,
    dType: raw.dType,
  }));

  return dishList;
}

/**
 * 根據 dNo 取得單筆 (GET /api/dishes/{dNo})
 */
export async function fetchDishById(dNo: number): Promise<Dish> {
  const res = await fetch(`${BASE_URL}/${dNo}`);
  if (!res.ok) {
    throw new Error(`單點 ${dNo} 不存在，HTTP 狀態：${res.status}`);
  }
  // 後端回傳一筆 RawDish
  const raw: RawDish = await res.json();
  return {
    dNo: raw.dNo,
    dName: raw.dName,
    dDesc: raw.dDesc,
    dPrice: raw.dPrice,
    dType: raw.dType,
  };
}

/**
 * 建立新單點 (POST /api/dishes)
 * 只傳後端需要的四個欄位：dName、dDesc、dPrice、dType
 */
export async function createDish(data: {
  dName: string;
  dDesc: string;
  dPrice: number;
  dType: string;
}): Promise<Dish> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dName: data.dName,
      dDesc: data.dDesc,
      dPrice: data.dPrice,
      dType: data.dType,
    }),
  });

  if (res.status === 409) {
    throw new Error("建立單點失敗：單點名稱與現有資料重複");
  }
  if (!res.ok) {
    throw new Error(`建立單點失敗，HTTP 狀態：${res.status}`);
  }

  // 後端會回傳 RawDish，裡面帶有 dNo
  const raw: RawDish = await res.json();
  return {
    dNo: raw.dNo,
    dName: raw.dName,
    dDesc: raw.dDesc,
    dPrice: raw.dPrice,
    dType: raw.dType,
  };
}

/**
 * 更新既有單點 (PUT /api/dishes/{dNo})
 * 只傳後端需要的四個欄位：dName、dDesc、dPrice、dType
 */
export async function updateDish(
  dNo: number,
  data: {
    dName: string;
    dDesc: string;
    dPrice: number;
    dType: string;
  }
): Promise<Dish> {
  const res = await fetch(`${BASE_URL}/${dNo}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      dName: data.dName,
      dDesc: data.dDesc,
      dPrice: data.dPrice,
      dType: data.dType,
    }),
  });

  if (res.status === 409) {
    throw new Error("更新單點失敗：單點名稱與現有資料重複");
  }
  if (!res.ok) {
    throw new Error(`更新單點 ${dNo} 失敗，HTTP 狀態：${res.status}`);
  }

  // 後端回傳 RawDish
  const raw: RawDish = await res.json();
  return {
    dNo: raw.dNo,
    dName: raw.dName,
    dDesc: raw.dDesc,
    dPrice: raw.dPrice,
    dType: raw.dType,
  };
}

/**
 * 刪除指定單點 (DELETE /api/dishes/{dNo})
 */
export async function deleteDish(dNo: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${dNo}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`刪除單點 ${dNo} 失敗，HTTP 狀態：${res.status}`);
  }
}
