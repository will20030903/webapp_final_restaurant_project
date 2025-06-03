// src/api/orderService.ts

import type { OrderInfo } from "../models/OrderInfo";
import type { OrderDetail } from "../models/OrderDetail";
import type {
  RawOrderInfo,
  RawOrderInfoResponse,
} from "../models/RawOrderInfoResponse";
// 這裡改成 import RawOrderDetail 而不是 RawOrderDetailResponse
import type { RawOrderDetail } from "../models/RawOrderDetail";

const BASE_URL = "http://163.25.107.227:8081/api/orders";

/**
 * 取得所有訂單 (GET /api/orders)
 */
export async function fetchAllOrders(): Promise<OrderInfo[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) {
    throw new Error(`無法讀取訂單列表，HTTP 狀態：${res.status}`);
  }
  const body: RawOrderInfoResponse = await res.json();
  const rawArr: RawOrderInfo[] = body._embedded?.orderInfoes ?? [];
  console.log("【DEBUG】fetchAllOrders rawArr:", rawArr);

  const orderInfoPromises = rawArr.map(async (raw): Promise<OrderInfo> => {
    let customerId: number | undefined = undefined;
    if (raw._links.customer?.href && typeof raw._links.customer.href === 'string') {
      const customerHrefParts = raw._links.customer.href.split('/');
      const potentialIdStr = customerHrefParts.pop();
      if (potentialIdStr) {
        let num = parseInt(potentialIdStr, 10);
        if (isNaN(num)) { // If direct parsing fails, it's an association link
          console.warn(`[DEBUG] customerId "${potentialIdStr}" is NaN. Attempting to fetch from association link: ${raw._links.customer.href}`);
          try {
            const assocRes = await fetch(raw._links.customer.href);
            if (assocRes.ok) {
              const associatedEntity = await assocRes.json();
              if (associatedEntity?._links?.self?.href && typeof associatedEntity._links.self.href === 'string') {
                const selfHrefParts = associatedEntity._links.self.href.split('/');
                const actualIdStr = selfHrefParts.pop();
                if (actualIdStr) {
                  num = parseInt(actualIdStr, 10);
                  if (isNaN(num)) {
                     console.warn(`[DEBUG] Could not parse actual customerId from self link: ${associatedEntity._links.self.href}`);
                  }
                }
              } else {
                console.warn(`[DEBUG] Fetched associated customer, but its _links.self.href is missing or invalid. URL: ${raw._links.customer.href}, Response:`, associatedEntity);
              }
            } else {
              console.warn(`[DEBUG] Failed to fetch associated customer from ${raw._links.customer.href}. Status: ${assocRes.status}`);
            }
          } catch (e) {
            console.error(`[DEBUG] Error fetching associated customer from ${raw._links.customer.href}:`, e);
          }
        }
        if (!isNaN(num)) {
          customerId = num;
        }
      }
    }

    let tableId: number | undefined = undefined;
    if (raw._links.tableInfo?.href && typeof raw._links.tableInfo.href === 'string') {
      const tableHrefParts = raw._links.tableInfo.href.split('/');
      const potentialIdStr = tableHrefParts.pop();
      if (potentialIdStr) {
        let num = parseInt(potentialIdStr, 10);
        if (isNaN(num)) { // If direct parsing fails, it's an association link
          console.warn(`[DEBUG] tableId "${potentialIdStr}" is NaN. Attempting to fetch from association link: ${raw._links.tableInfo.href}`);
          try {
            const assocRes = await fetch(raw._links.tableInfo.href);
            if (assocRes.ok) {
              const associatedEntity = await assocRes.json();
              if (associatedEntity?._links?.self?.href && typeof associatedEntity._links.self.href === 'string') {
                const selfHrefParts = associatedEntity._links.self.href.split('/');
                const actualIdStr = selfHrefParts.pop();
                if (actualIdStr) {
                  num = parseInt(actualIdStr, 10);
                  if (isNaN(num)) {
                     console.warn(`[DEBUG] Could not parse actual tableId from self link: ${associatedEntity._links.self.href}`);
                  }
                }
              } else {
                console.warn(`[DEBUG] Fetched associated table, but its _links.self.href is missing or invalid. URL: ${raw._links.tableInfo.href}, Response:`, associatedEntity);
              }
            } else {
              console.warn(`[DEBUG] Failed to fetch associated table from ${raw._links.tableInfo.href}. Status: ${assocRes.status}`);
            }
          } catch (e) {
            console.error(`[DEBUG] Error fetching associated table from ${raw._links.tableInfo.href}:`, e);
          }
        }
        if (!isNaN(num)) {
          tableId = num;
        }
      }
    }

    const detailsRaw: RawOrderDetail[] = raw._embedded?.orderDetailses ?? [];
    const details: OrderDetail[] = detailsRaw.map((d) => {
      let itemType: "dish" | "set";
      let itemId: number;
      if (d._links.dish?.href) {
        itemType = "dish";
        itemId = Number(d._links.dish.href.split("/").pop());
      } else if (d._links.setMeal?.href) {
        itemType = "set";
        itemId = Number(d._links.setMeal.href.split("/").pop());
      } else {
        // Should not happen with valid data, but good to handle
        console.error("Order detail item has neither dish nor setMeal link:", d);
        throw new Error("Invalid order detail item");
      }
      return {
        odId: d.odId,
        quantity: d.quantity,
        subTotal: d.subTotal,
        itemType,
        itemId,
      };
    });

    return {
      oId: raw.oId,
      oDateTime: raw.oDateTime,
      totalPrice: raw.totalPrice,
      payStatus: raw.payStatus,
      customerId,
      tableId,
      orderDetailses: details,
    };
  });

  return Promise.all(orderInfoPromises);
}

/**
 * 根據 oId 取得單筆訂單 (GET /api/orders/{oId})
 */
export async function fetchOrderById(oId: number): Promise<OrderInfo> {
  const res = await fetch(`${BASE_URL}/${oId}`);
  if (!res.ok) {
    throw new Error(`訂單 ${oId} 不存在，HTTP 狀態：${res.status}`);
  }
  const raw: RawOrderInfo = await res.json();

  let customerId: number | undefined = undefined;
  if (raw._links.customer?.href && typeof raw._links.customer.href === 'string') {
    const customerHrefParts = raw._links.customer.href.split('/');
    const potentialIdStr = customerHrefParts.pop();
    if (potentialIdStr) {
      let num = parseInt(potentialIdStr, 10);
      if (isNaN(num)) { // If direct parsing fails, it's an association link
        console.warn(`[DEBUG] customerId "${potentialIdStr}" for oId ${oId} is NaN. Attempting to fetch from association link: ${raw._links.customer.href}`);
        try {
          const assocRes = await fetch(raw._links.customer.href);
          if (assocRes.ok) {
            const associatedEntity = await assocRes.json();
            if (associatedEntity?._links?.self?.href && typeof associatedEntity._links.self.href === 'string') {
              const selfHrefParts = associatedEntity._links.self.href.split('/');
              const actualIdStr = selfHrefParts.pop();
              if (actualIdStr) {
                num = parseInt(actualIdStr, 10);
                if (isNaN(num)) {
                   console.warn(`[DEBUG] Could not parse actual customerId from self link for oId ${oId}: ${associatedEntity._links.self.href}`);
                }
              }
            } else {
              console.warn(`[DEBUG] Fetched associated customer for oId ${oId}, but its _links.self.href is missing or invalid. URL: ${raw._links.customer.href}, Response:`, associatedEntity);
            }
          } else {
            console.warn(`[DEBUG] Failed to fetch associated customer for oId ${oId} from ${raw._links.customer.href}. Status: ${assocRes.status}`);
          }
        } catch (e) {
          console.error(`[DEBUG] Error fetching associated customer for oId ${oId} from ${raw._links.customer.href}:`, e);
        }
      }
      if (!isNaN(num)) {
        customerId = num;
      }
    }
  }

  let tableId: number | undefined = undefined;
  if (raw._links.tableInfo?.href && typeof raw._links.tableInfo.href === 'string') {
    const tableHrefParts = raw._links.tableInfo.href.split('/');
    const potentialIdStr = tableHrefParts.pop();
    if (potentialIdStr) {
      let num = parseInt(potentialIdStr, 10);
      if (isNaN(num)) { // If direct parsing fails, it's an association link
        console.warn(`[DEBUG] tableId "${potentialIdStr}" for oId ${oId} is NaN. Attempting to fetch from association link: ${raw._links.tableInfo.href}`);
        try {
          const assocRes = await fetch(raw._links.tableInfo.href);
          if (assocRes.ok) {
            const associatedEntity = await assocRes.json();
            if (associatedEntity?._links?.self?.href && typeof associatedEntity._links.self.href === 'string') {
              const selfHrefParts = associatedEntity._links.self.href.split('/');
              const actualIdStr = selfHrefParts.pop();
              if (actualIdStr) {
                num = parseInt(actualIdStr, 10);
                if (isNaN(num)) {
                   console.warn(`[DEBUG] Could not parse actual tableId from self link for oId ${oId}: ${associatedEntity._links.self.href}`);
                }
              }
            } else {
              console.warn(`[DEBUG] Fetched associated table for oId ${oId}, but its _links.self.href is missing or invalid. URL: ${raw._links.tableInfo.href}, Response:`, associatedEntity);
            }
          } else {
            console.warn(`[DEBUG] Failed to fetch associated table for oId ${oId} from ${raw._links.tableInfo.href}. Status: ${assocRes.status}`);
          }
        } catch (e) {
          console.error(`[DEBUG] Error fetching associated table for oId ${oId} from ${raw._links.tableInfo.href}:`, e);
        }
      }
      if (!isNaN(num)) {
        tableId = num;
      }
    }
  }

  const detailsRaw: RawOrderDetail[] = raw._embedded?.orderDetailses ?? [];
  const details: OrderDetail[] = detailsRaw.map((d) => {
    let itemType: "dish" | "set";
    let itemId: number;
    if (d._links.dish) {
      itemType = "dish";
      itemId = Number(d._links.dish.href.split("/").pop());
    } else {
      itemType = "set";
      itemId = Number(d._links.setMeal!.href.split("/").pop());
    }
    return {
      odId: d.odId,
      quantity: d.quantity,
      subTotal: d.subTotal,
      itemType,
      itemId,
    };
  });

  return {
    oId: raw.oId,
    oDateTime: raw.oDateTime,
    totalPrice: raw.totalPrice,
    payStatus: raw.payStatus,
    customerId,
    tableId,
    orderDetailses: details,
  };
}

/**
 * 建立新訂單 (POST /api/orders)
 */
export async function createOrder(data: {
  oDateTime: string;
  payStatus: string;
  totalPrice: number;
  customerId: number;
  tableId: number;
  orderDetailses: {
    dishOrSetType: "dish" | "set";
    itemId: number;
    quantity: number;
    subTotal: number;
  }[];
}): Promise<OrderInfo> {
  const payload: {
    oDateTime: string;
    payStatus: string;
    totalPrice: number;
    customer: string;
    tableInfo: string;
    orderDetailses: {
      dish: string | null;
      setMeal: string | null;
      quantity: number;
      subTotal: number;
    }[];
  } = {
    oDateTime: data.oDateTime,
    payStatus: data.payStatus,
    totalPrice: data.totalPrice,
    customer: `/api/customers/${data.customerId}`,
    tableInfo: `/api/tables/${data.tableId}`,
    orderDetailses: data.orderDetailses.map((d) => {
      if (d.dishOrSetType === "dish") {
        return {
          dish: `/api/dishes/${d.itemId}`,
          setMeal: null,
          quantity: d.quantity,
          subTotal: d.subTotal,
        };
      } else {
        return {
          dish: null,
          setMeal: `/api/sets/${d.itemId}`,
          quantity: d.quantity,
          subTotal: d.subTotal,
        };
      }
    }),
  };

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`建立訂單失敗，HTTP 狀態：${res.status}`);
  }
  const raw: RawOrderInfo = await res.json();

  let customerId: number | undefined;
  let tableId: number | undefined;
  if (raw._links.customer) {
    customerId = Number(raw._links.customer.href.split("/").pop());
  }
  if (raw._links.tableInfo) {
    tableId = Number(raw._links.tableInfo.href.split("/").pop());
  }

  const detailsRaw: RawOrderDetail[] = raw._embedded?.orderDetailses ?? [];
  const details: OrderDetail[] = detailsRaw.map((d) => {
    let itemType: "dish" | "set";
    let itemId: number;
    if (d._links.dish) {
      itemType = "dish";
      itemId = Number(d._links.dish.href.split("/").pop());
    } else {
      itemType = "set";
      itemId = Number(d._links.setMeal!.href.split("/").pop());
    }
    return {
      odId: d.odId,
      quantity: d.quantity,
      subTotal: d.subTotal,
      itemType,
      itemId,
    };
  });

  return {
    oId: raw.oId,
    oDateTime: raw.oDateTime,
    totalPrice: raw.totalPrice,
    payStatus: raw.payStatus,
    customerId,
    tableId,
    orderDetailses: details,
  };
}

/**
 * 更新既有訂單 (PUT /api/orders/{oId})
 */
export async function updateOrder(
  oId: number,
  data: {
    oDateTime: string;
    totalPrice: number;
    payStatus: string;
    customerId: number;
    tableId: number;
    orderDetailses: {
      dishOrSetType: "dish" | "set";
      itemId: number;
      quantity: number;
      subTotal: number;
    }[];
  }
): Promise<OrderInfo> {
  const payload: {
    oDateTime: string;
    totalPrice: number;
    payStatus: string;
    customer: string;
    tableInfo: string;
    orderDetailses: {
      dish: string | null;
      setMeal: string | null;
      quantity: number;
      subTotal: number;
    }[];
  } = {
    oDateTime: data.oDateTime,
    totalPrice: data.totalPrice,
    payStatus: data.payStatus,
    customer: `/api/customers/${data.customerId}`,
    tableInfo: `/api/tables/${data.tableId}`,
    orderDetailses: data.orderDetailses.map((d) => {
      if (d.dishOrSetType === "dish") {
        return {
          dish: `/api/dishes/${d.itemId}`,
          setMeal: null,
          quantity: d.quantity,
          subTotal: d.subTotal,
        };
      } else {
        return {
          dish: null,
          setMeal: `/api/sets/${d.itemId}`,
          quantity: d.quantity,
          subTotal: d.subTotal,
        };
      }
    }),
  };

  const res = await fetch(`${BASE_URL}/${oId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(`更新訂單 ${oId} 失敗，HTTP 狀態：${res.status}`);
  }
  const raw: RawOrderInfo = await res.json();

  let customerId: number | undefined;
  let tableId: number | undefined;
  if (raw._links.customer) {
    customerId = Number(raw._links.customer.href.split("/").pop());
  }
  if (raw._links.tableInfo) {
    tableId = Number(raw._links.tableInfo.href.split("/").pop());
  }

  const detailsRaw: RawOrderDetail[] = raw._embedded?.orderDetailses ?? [];
  const details: OrderDetail[] = detailsRaw.map((d) => {
    let itemType: "dish" | "set";
    let itemId: number;
    if (d._links.dish) {
      itemType = "dish";
      itemId = Number(d._links.dish.href.split("/").pop());
    } else {
      itemType = "set";
      itemId = Number(d._links.setMeal!.href.split("/").pop());
    }
    return {
      odId: d.odId,
      quantity: d.quantity,
      subTotal: d.subTotal,
      itemType,
      itemId,
    };
  });

  return {
    oId: raw.oId,
    oDateTime: raw.oDateTime,
    totalPrice: raw.totalPrice,
    payStatus: raw.payStatus,
    customerId,
    tableId,
    orderDetailses: details,
  };
}

/**
 * 刪除指定訂單 (DELETE /api/orders/{oId})
 */
export async function deleteOrder(oId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${oId}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error(`刪除訂單 ${oId} 失敗，HTTP 狀態：${res.status}`);
  }
}