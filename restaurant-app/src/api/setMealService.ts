// src/api/setMealService.ts
import type { SetMeal } from "../models/SetMeal";
import type { RawSetMeal, RawSetMealResponse } from "../models/RawSetMealResponse";

const BASE_URL = "http://163.25.107.227:8081/api/sets";

/**
 * 取得所有套餐 (GET /api/sets)
 */
export async function fetchAllSetMeals(): Promise<SetMeal[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`無法讀取所有套餐，HTTP 狀態：${res.status}`);
  }
  const body: RawSetMealResponse = await res.json();
  const rawArr: RawSetMeal[] = body._embedded?.setMeals ?? [];
  console.log("【DEBUG】fetchAllSetMeals rawArr：", rawArr);
  return rawArr.map((raw) => ({
    sNo: raw.sNo,
    sName: raw.sName,
    sDesc: raw.sDesc,
    sPrice: raw.sPrice,
  }));
}

/**
 * 根據 sNo 取得單筆套餐 (GET /api/sets/{sNo})
 */
export async function fetchSetMealById(sNo: number): Promise<SetMeal> {
  const res = await fetch(`${BASE_URL}/${sNo}`);
  if (!res.ok) {
    throw new Error(`套餐 ${sNo} 不存在，HTTP 狀態：${res.status}`);
  }
  const raw: RawSetMeal = await res.json();
  return {
    sNo: raw.sNo,
    sName: raw.sName,
    sDesc: raw.sDesc,
    sPrice: raw.sPrice,
  };
}

/**
 * 建立新套餐 (POST /api/sets)
 * 只傳 sName, sDesc, sPrice
 */
export async function createSetMeal(data: {
  sName: string;
  sDesc: string;
  sPrice: number;
}): Promise<SetMeal> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sName: data.sName,
      sDesc: data.sDesc,
      sPrice: data.sPrice,
    }),
  });
  if (res.status === 409) {
    throw new Error("建立套餐失敗：套餐名稱重複");
  }
  if (!res.ok) {
    throw new Error(`建立套餐失敗，HTTP 狀態：${res.status}`);
  }
  const raw: RawSetMeal = await res.json();
  return {
    sNo: raw.sNo,
    sName: raw.sName,
    sDesc: raw.sDesc,
    sPrice: raw.sPrice,
  };
}

/**
 * 更新既有套餐 (PUT /api/sets/{sNo})
 * 只傳 sName, sDesc, sPrice
 */
export async function updateSetMeal(
  sNo: number,
  data: {
    sName: string;
    sDesc: string;
    sPrice: number;
  }
): Promise<SetMeal> {
  const res = await fetch(`${BASE_URL}/${sNo}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      sName: data.sName,
      sDesc: data.sDesc,
      sPrice: data.sPrice,
    }),
  });
  if (res.status === 409) {
    throw new Error("更新套餐失敗：套餐名稱重複");
  }
  if (!res.ok) {
    throw new Error(`更新套餐 ${sNo} 失敗，HTTP 狀態：${res.status}`);
  }
  const raw: RawSetMeal = await res.json();
  return {
    sNo: raw.sNo,
    sName: raw.sName,
    sDesc: raw.sDesc,
    sPrice: raw.sPrice,
  };
}

/**
 * 刪除指定套餐 (DELETE /api/sets/{sNo})
 */
export async function deleteSetMeal(sNo: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${sNo}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`刪除套餐 ${sNo} 失敗，HTTP 狀態：${res.status}`);
  }
}
