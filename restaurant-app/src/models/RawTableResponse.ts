// src/models/RawTableResponse.ts

/**
 * 後端單筆 TableInfo 資料的原始結構 (RawTable)
 * 主鍵欄位是 tId
 */
export interface RawTable {
  tId: number;
  capacity: number;
  location: string;
  _links: {
    [rel: string]: { href: string };
  };
}

/**
 * Spring Data REST 回傳的「GET /api/tables」結構 (RawTableResponse)
 */
export interface RawTableResponse {
  _embedded: {
    tableInfoes: RawTable[];
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
