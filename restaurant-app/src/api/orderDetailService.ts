// src/api/orderDetailService.ts
import type { OrderDetail } from "../models/OrderDetail";
import type { RawOrderDetail, RawOrderDetailResponse } from "../models/RawOrderDetailResponse";

const BASE_URL = "http://163.25.107.227:8081/api/orderDetails";

/**
 * 取得所有 OrderDetail (GET /api/orderDetails)
 */
export async function fetchAllOrderDetails(): Promise<OrderDetail[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`無法讀取訂單明細，HTTP 狀態：${res.status}`);
  }
  const body: RawOrderDetailResponse = await res.json();
  const rawArr: RawOrderDetail[] = body._embedded?.orderDetails ?? [];
  console.log("【DEBUG】fetchAllOrderDetails rawArr：", rawArr);

  return rawArr.map((raw) => {
    let itemType: "dish" | "set";
    let itemId: number;
    if (raw._links.dish) {
      itemType = "dish";
      itemId = Number(raw._links.dish.href.split("/").pop());
    } else {
      itemType = "set";
      itemId = Number(raw._links.setMeal!.href.split("/").pop());
    }
    return {
      odId: raw.odId,
      quantity: raw.quantity,
      subTotal: raw.subTotal,
      itemType,
      itemId,
    };
  });
}

/**
 * 根據 odId 取得單筆 OrderDetail (GET /api/orderDetails/{odId})
 */
export async function fetchOrderDetailById(odId: number): Promise<OrderDetail> {
  const res = await fetch(`${BASE_URL}/${odId}`);
  if (!res.ok) {
    throw new Error(`訂單明細 ${odId} 不存在，HTTP 狀態：${res.status}`);
  }
  const raw: RawOrderDetail = await res.json();

  let itemType: "dish" | "set";
  let itemId: number;
  if (raw._links.dish) {
    itemType = "dish";
    itemId = Number(raw._links.dish.href.split("/").pop());
  } else {
    itemType = "set";
    itemId = Number(raw._links.setMeal!.href.split("/").pop());
  }

  return {
    odId: raw.odId,
    quantity: raw.quantity,
    subTotal: raw.subTotal,
    itemType,
    itemId,
  };
}

/**
 * 建立新 OrderDetail (POST /api/orderDetails)
 * 注意 payload 需要按 Spring Data REST 關聯格式傳送：
 *   { "orderInfo": "/api/orders/{orderId}", "dish": "/api/dishes/{dNo}" or null, "setMeal": "/api/sets/{sNo}" or null, "quantity": n, "subTotal": x }
 */
export async function createOrderDetail(data: {
  dishOrSetType: "dish" | "set";
  itemId: number;
  quantity: number;
  subTotal: number;
  orderId: number;
}): Promise<OrderDetail> {
  const payload: {
    quantity: number;
    subTotal: number;
    orderInfo: string;
    dish: string | null;
    setMeal: string | null;
  } = {
    quantity: data.quantity,
    subTotal: data.subTotal,
    orderInfo: `/api/orders/${data.orderId}`,
    dish: null,
    setMeal: null,
  };
  if (data.dishOrSetType === "dish") {
    payload.dish = `/api/dishes/${data.itemId}`;
    payload.setMeal = null;
  } else {
    payload.setMeal = `/api/sets/${data.itemId}`;
    payload.dish = null;
  }

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`建立訂單明細失敗，HTTP 狀態：${res.status}`);
  }
  const raw: RawOrderDetail = await res.json();

  let itemType: "dish" | "set";
  let itemId: number;
  if (raw._links.dish) {
    itemType = "dish";
    itemId = Number(raw._links.dish.href.split("/").pop());
  } else {
    itemType = "set";
    itemId = Number(raw._links.setMeal!.href.split("/").pop());
  }

  return {
    odId: raw.odId,
    quantity: raw.quantity,
    subTotal: raw.subTotal,
    itemType,
    itemId,
  };
}

/**
 * 更新既有 OrderDetail (PUT /api/orderDetails/{odId})
 */
export async function updateOrderDetail(
  odId: number,
  data: {
    dishOrSetType: "dish" | "set";
    itemId: number;
    quantity: number;
    subTotal: number;
    orderId: number;
  }
): Promise<OrderDetail> {
  const payload: {
    quantity: number;
    subTotal: number;
    orderInfo: string;
    dish: string | null;
    setMeal: string | null;
  } = {
    quantity: data.quantity,
    subTotal: data.subTotal,
    orderInfo: `/api/orders/${data.orderId}`,
    dish: null,
    setMeal: null,
  };
  if (data.dishOrSetType === "dish") {
    payload.dish = `/api/dishes/${data.itemId}`;
    payload.setMeal = null;
  } else {
    payload.setMeal = `/api/sets/${data.itemId}`;
    payload.dish = null;
  }

  const res = await fetch(`${BASE_URL}/${odId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`更新訂單明細 ${odId} 失敗，HTTP 狀態：${res.status}`);
  }
  const raw: RawOrderDetail = await res.json();

  let itemType: "dish" | "set";
  let itemId: number;
  if (raw._links.dish) {
    itemType = "dish";
    itemId = Number(raw._links.dish.href.split("/").pop());
  } else {
    itemType = "set";
    itemId = Number(raw._links.setMeal!.href.split("/").pop());
  }

  return {
    odId: raw.odId,
    quantity: raw.quantity,
    subTotal: raw.subTotal,
    itemType,
    itemId,
  };
}

/**
 * 刪除指定 OrderDetail (DELETE /api/orderDetails/{odId})
 */
export async function deleteOrderDetail(odId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${odId}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`刪除訂單明細 ${odId} 失敗，HTTP 狀態：${res.status}`);
  }
}
