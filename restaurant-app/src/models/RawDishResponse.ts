// src/models/RawDishResponse.ts

/**
 * 後端單筆 Dish 資料的原始結構 (RawDish)
 * 注意：主鍵欄位是 dNo (不是 id)
 */
export interface RawDish {
  dNo: number;           // 後端直接輸出 dNo
  dName: string;
  dDesc: string;
  dPrice: number;
  dType: string;
  _links: {
    [rel: string]: {
      href: string;
    };
  };
}

/**
 * Spring Data REST 回傳的「GET /api/dishes」結構 (RawDishResponse)
 * {
 *   "_embedded": {
 *     "dishes": RawDish[]
 *   },
 *   "_links": { ... },
 *   "page": { ... }
 * }
 */
export interface RawDishResponse {
  _embedded: {
    dishes: RawDish[];
  };
  _links: {
    [rel: string]: {
      href: string;
    };
  };
  page: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
}
