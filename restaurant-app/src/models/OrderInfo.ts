// src/models/OrderInfo.ts
import type { OrderDetail } from "./OrderDetail";

/**
 * 前端純淨用的 OrderInfo 型別
 */
export interface OrderInfo {
  oId: number;
  oDateTime: string;       // ISO 字串，或可自行轉成 Date
  totalPrice: number;
  payStatus: string;
  customerId?: number;     // 後端關聯回傳的顧客 cId
  tableId?: number;        // 後端關聯回傳的餐桌 tId
  orderDetailses: OrderDetail[];
}
