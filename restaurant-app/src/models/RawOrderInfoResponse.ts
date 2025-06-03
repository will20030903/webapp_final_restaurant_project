// src/models/RawOrderInfoResponse.ts

import type { RawOrderDetail } from "./RawOrderDetail";

/**
 * RawOrderInfo：描述 Spring Data REST 回傳的 OrderInfo 原始 JSON
 * 包含 oId、oDateTime、totalPrice、payStatus，以及 _links 與 _embedded.orderDetailses。
 */
export interface RawOrderInfo {
  oId: number;
  oDateTime: string;
  totalPrice: number;
  payStatus: string;
  _links: {
    self: { href: string };
    orderInfo: { href: string };
    customer?: { href: string };
    tableInfo?: { href: string };
  };
  _embedded?: {
    orderDetailses: RawOrderDetail[];
  };
}

/**
 * RawOrderInfoResponse：Spring Data REST 回傳 GET /api/orders 時的包裝格式
 * 包含 _embedded.orders（RawOrderInfo 陣列）、_links 與分頁資訊。
 */
export interface RawOrderInfoResponse {
  _embedded: {
    orderInfoes: RawOrderInfo[];
  };
  _links: {
    self: { href: string };
    profile?: { href: string };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
