// src/models/RawOrderDetail.ts

/**
 * 後端 OrderDetails 原始結構 (RawOrderDetail)：
 * 包含 odId、quantity、subTotal，以及 _links 內的 dish/setMeal/orderInfo 關聯連結。
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
