// src/api/customerService.ts
import type { Customer } from "../models/Customer";
import type { RawCustomer, RawCustomerResponse } from "../models/RawCustomerResponse";

const BASE_URL = "http://163.25.107.227:8081/api/customers";

/**
 * 取得所有顧客 (GET /api/customers)
 */
export async function fetchAllCustomers(): Promise<Customer[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`無法讀取顧客列表，HTTP 狀態：${res.status}`);
  }
  const body: RawCustomerResponse = await res.json();
  const rawArr: RawCustomer[] = body._embedded?.customers ?? [];
  console.log("【DEBUG】fetchAllCustomers rawArr：", rawArr);
  return rawArr.map((raw) => ({
    cId: raw.cId,
    cName: raw.cName,
    cPhone: raw.cPhone,
  }));
}

/**
 * 根據 cId 取得單筆顧客 (GET /api/customers/{cId})
 */
export async function fetchCustomerById(cId: number): Promise<Customer> {
  const res = await fetch(`${BASE_URL}/${cId}`);
  if (!res.ok) {
    throw new Error(`顧客 ${cId} 不存在，HTTP 狀態：${res.status}`);
  }
  const raw: RawCustomer = await res.json();
  return {
    cId: raw.cId,
    cName: raw.cName,
    cPhone: raw.cPhone,
  };
}

/**
 * 建立新顧客 (POST /api/customers)
 * 只傳 cName, cPhone
 */
export async function createCustomer(data: {
  cName: string;
  cPhone: string;
}): Promise<Customer> {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cName: data.cName,
      cPhone: data.cPhone,
    }),
  });
  if (res.status === 409) {
    throw new Error("建立顧客失敗：電話重複");
  }
  if (!res.ok) {
    throw new Error(`建立顧客失敗，HTTP 狀態：${res.status}`);
  }
  const raw: RawCustomer = await res.json();
  return {
    cId: raw.cId,
    cName: raw.cName,
    cPhone: raw.cPhone,
  };
}

/**
 * 更新既有顧客 (PUT /api/customers/{cId})
 * 只傳 cName, cPhone
 */
export async function updateCustomer(
  cId: number,
  data: {
    cName: string;
    cPhone: string;
  }
): Promise<Customer> {
  const res = await fetch(`${BASE_URL}/${cId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cName: data.cName,
      cPhone: data.cPhone,
    }),
  });
  if (res.status === 409) {
    throw new Error("更新顧客失敗：電話重複");
  }
  if (!res.ok) {
    throw new Error(`更新顧客 ${cId} 失敗，HTTP 狀態：${res.status}`);
  }
  const raw: RawCustomer = await res.json();
  return {
    cId: raw.cId,
    cName: raw.cName,
    cPhone: raw.cPhone,
  };
}

/**
 * 刪除指定顧客 (DELETE /api/customers/{cId})
 */
export async function deleteCustomer(cId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${cId}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`刪除顧客 ${cId} 失敗，HTTP 狀態：${res.status}`);
  }
}
