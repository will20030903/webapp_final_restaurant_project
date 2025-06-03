// src/models/RawSetMealResponse.ts

/**
 * 後端單筆 SetMeal 資料的原始結構 (RawSetMeal)
 * 主鍵欄位是 sNo
 */
export interface RawSetMeal {
  sNo: number;
  sName: string;
  sDesc: string;
  sPrice: number;
  // 假設後端回傳的套餐裡面還有一個 _embedded.setDishes, 如果需要也可擴充
  _links: {
    [rel: string]: { href: string };
  };
}

/**
 * Spring Data REST 回傳的「GET /api/sets」結構 (RawSetMealResponse)
 */
export interface RawSetMealResponse {
  _embedded: {
    setMeals: RawSetMeal[];
  };
  _links: {
    [rel: string]: { href: string };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
