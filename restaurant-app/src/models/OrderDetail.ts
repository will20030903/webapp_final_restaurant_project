// src/models/OrderDetail.ts

/**
 * 前端純淨用的 OrderDetail 型別
 */
export interface OrderDetail {
  odId: number;
  quantity: number;
  subTotal: number;
  itemType: "dish" | "set"; // 用來區分是單點還是套餐
  itemId: number;           // 如果 itemType==="dish" 就是 dNo；如果 itemType==="set" 就是 sNo
}
