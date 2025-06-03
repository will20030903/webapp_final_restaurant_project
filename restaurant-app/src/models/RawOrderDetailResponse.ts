// src/models/RawOrderDetailResponse.ts

/**
 * 後端 OrderDetails 原始結構 (RawOrderDetail)
 */
export interface RawOrderDetail {
  odId: number;
  quantity: number;
  subTotal: number;
  _links: {
    self: { href: string };
    orderDetail: { href: string };
    dish?: { href: string };
    setMeal?: { href: string };
    orderInfo?: { href: string };
  };
}

/**
 * Spring Data REST 回傳 GET /api/orderDetails 的包裝格式
 */
export interface RawOrderDetailResponse {
  _embedded: {
    orderDetails: RawOrderDetail[];
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
