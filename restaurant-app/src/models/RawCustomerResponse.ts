// src/models/RawCustomerResponse.ts

/**
 * 後端單筆 Customer 資料的原始結構 (RawCustomer)
 * 主鍵欄位是 cId
 */
export interface RawCustomer {
  cId: number;
  cName: string;
  cPhone: string;
  _links: {
    [rel: string]: { href: string };
  };
}

/**
 * Spring Data REST 回傳的「GET /api/customers」結構 (RawCustomerResponse)
 */
export interface RawCustomerResponse {
  _embedded: {
    customers: RawCustomer[];
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
