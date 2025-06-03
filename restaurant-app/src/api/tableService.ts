// src/api/tableService.ts
import type { TableInfo } from "../models/TableInfo";
import type { RawTable, RawTableResponse } from "../models/RawTableResponse";

const BASE_URL = "http://163.25.107.227:8081/api/tables";

/**
 * 取得所有餐桌 (GET /api/tables)
 */
export async function fetchAllTables(): Promise<TableInfo[]> {
  const res = await fetch(BASE_URL, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`無法讀取餐桌列表，HTTP 狀態：${res.status}`);
  }
  const body: RawTableResponse = await res.json();
  const rawArr: RawTable[] = body._embedded?.tableInfoes ?? [];
  console.log("【DEBUG】fetchAllTables rawArr：", rawArr);
  return rawArr.map((raw) => ({
    tId: raw.tId,
    capacity: raw.capacity,
    location: raw.location,
  }));
}

/**
 * 根據 tId 取得單筆餐桌 (GET /api/tables/{tId})
 */
export async function fetchTableById(tId: number): Promise<TableInfo> {
  const res = await fetch(`${BASE_URL}/${tId}`);
  if (!res.ok) {
    throw new Error(`餐桌 ${tId} 不存在，HTTP 狀態：${res.status}`);
  }
  const raw: RawTable = await res.json();
  return {
    tId: raw.tId,
    capacity: raw.capacity,
    location: raw.location,
  };
}

/**
 * 建立新餐桌 (POST /api/tables)
 * 只傳 capacity, location
 */
export async function createTable(data: {
  capacity: number;
  location: string;
}): Promise<TableInfo> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      capacity: data.capacity,
      location: data.location,
    }),
  });
  if (!res.ok) {
    throw new Error(`建立餐桌失敗，HTTP 狀態：${res.status}`);
  }
  const raw: RawTable = await res.json();
  return {
    tId: raw.tId,
    capacity: raw.capacity,
    location: raw.location,
  };
}

/**
 * 更新既有餐桌 (PUT /api/tables/{tId})
 * 只傳 capacity, location
 */
export async function updateTable(
  tId: number,
  data: {
    capacity: number;
    location: string;
  }
): Promise<TableInfo> {
  const res = await fetch(`${BASE_URL}/${tId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      capacity: data.capacity,
      location: data.location,
    }),
  });
  if (!res.ok) {
    throw new Error(`更新餐桌 ${tId} 失敗，HTTP 狀態：${res.status}`);
  }
  const raw: RawTable = await res.json();
  return {
    tId: raw.tId,
    capacity: raw.capacity,
    location: raw.location,
  };
}

/**
 * 刪除指定餐桌 (DELETE /api/tables/{tId})
 */
export async function deleteTable(tId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${tId}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`刪除餐桌 ${tId} 失敗，HTTP 狀態：${res.status}`);
  }
}
