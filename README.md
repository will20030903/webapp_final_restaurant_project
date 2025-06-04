# webapp_final_restaurant_project
a webapp restaurant using React + TypeScript + Tailwind CSS +spring boot +rest api

##專案概述
```text
-- 這是一套以「餐廳訂餐及後台管理」為核心的 Web 應用，完整涵蓋前端點餐、後端資料處理與管理功能。
-- 前端採用 React + TypeScript 開發，提供使用者友善的點餐介面與管理介面。
-- 後端使用 Spring Boot（Spring Data JPA）搭配 MariaDB，負責各種資料庫的 CRUD 操作與 REST API。
-- 資料庫主要儲存「桌位（Table）」、「菜品（Dish）」、「顧客（Customer）」、「訂單（Order）」、「訂單明細（OrderDetail）」等核心實體。
```

##使用技術
```text
-- 前端
---- React 17+ & TypeScript 4+
---- React Router v6：負責頁面路由切換（例如結帳頁、菜品管理、桌位管理）
---- Axios：與後端 API 通訊
---- CSS 模組化（或 Tailwind CSS）：自訂樣式
---- Context API：管理購物車（Cart）與全域狀態

-- 後端
---- Spring Boot 2.7+（Spring Web, Spring Data JPA）
---- MariaDB（MySQL 相容）
---- JPA Entities & Repository：以註解方式定義實體類別與資料表關聯
---- RESTful API：CRUD 接口，回傳 JSON 格式

-- 資料庫
---- MariaDB
---- five tables: Customer、TableInfo、Dish、Order、OrderDetail
```

##系統架構圖
```text
┌───────────────────┐      ┌─────────────────────────┐      ┌───────────────┐
│    前端 (React)   │─────▶│ 後端 (Spring Boot)      │─────▶│ MariaDB (DB)  │
│ – 點餐頁面        │  API │ – Controller / Service   │ CRUD │ – 5 個資料表   │
│ – 購物車管理     │─────▶│ – JPA Entity & Repository│─────▶│               │
│ – 管理介面 (菜品、 │ GET/ │ – RESTful Endpoints      │ SQL  │               │
│    桌位、訂單查詢) │ POST └──────────────────────────┘      └───────────────┘
└───────────────────┘ etc
```
##前端架構概述
```text

├─ restaurant-app/               # 前端 React 應用程式（專案本體）
│
├─ node_modules/                 # npm 安裝的套件（由 package.json 管理，不需手動編輯）
│
├─ public/                       # 靜態資源資料夾 (favicon、index.html 模板、公開可存取的檔案)
│
├─ src/                          # 前端程式碼主資料夾
│   │
│   ├─ admin/                    # 管理後臺 (後台管理介面) 的所有 React 元件與頁面
│   │   ├─ components/           # 管理介面專用的共用元件 (例如 Modal、Form、表格等)
│   │   └─ pages/                # 管理者所需的各個 CRUD 頁面 (例如菜品管理、桌位管理、訂單查詢)
│   │
│   ├─ api/                      # 封裝所有與後端溝通的服務 (Service) 函式
│   │   ├─ customerService.ts    # Customer 相關的 API 呼叫
│   │   ├─ dishService.ts        # 菜品 (Dish) 相關的 CRUD API
│   │   ├─ orderDetailService.ts # 訂單明細 (OrderDetail) 相關 API
│   │   ├─ orderService.ts       # 訂單 (Order) 相關 API
│   │   ├─ setMealService.ts     # 套餐 (SetMeal) 相關 API
│   │   └─ tableService.ts       # 桌位 (Table) 相關 API
│   │
│   ├─ assets/                   # 靜態圖片、SVG、Banner 等可直接引入的資源
│   │   ├─ banner.png
│   │   ├─ HeroImage.jpeg
│   │   └─ react.svg
│   │
│   ├─ client/                   # 客戶端（使用者端）相關的元件與頁面
│   │   ├─ components/           # 客戶端專用的共用元件，例如：卡片、按鈕、彈窗等等
│   │   ├─ pages/                # 客戶端主頁面，例如：主餐單、單一菜品頁、購物車頁面……
│   │   └─ CartContext.tsx       # 購物車全域狀態管理 (React Context)，負責儲存使用者目前選擇的品項
│   │
│   ├─ components/               # 和客戶端、後臺都會共用的 UI 元件（例如：頂部導覽列 Navbar、頁尾 Footer 等）
│   │   ├─ Footer.tsx
│   │   └─ Navbar.tsx
│   │
│   ├─ models/                   # TypeScript 介面 (Interfaces) / 型別 (Types)，對應後端回傳的資料結構
│   │   ├─ Customer.ts           # Customer 介面定義
│   │   ├─ Dish.ts               # Dish (菜品) 介面定義
│   │   ├─ OrderDetail.ts        # OrderDetail (訂單明細) 介面
│   │   ├─ OrderInfo.ts          # OrderInfo (訂單總表) 介面
│   │   ├─ RawCustomerResponse.ts    # 對應後端原始 JSON 的型別（未經轉換版本）
│   │   ├─ RawDishResponse.ts        # …
│   │   ├─ RawOrderDetail.ts         # …
│   │   ├─ RawOrderDetailResponse.ts # …
│   │   ├─ RawOrderInfoResponse.ts   # …
│   │   ├─ RawSetMealResponse.ts     # …
│   │   ├─ RawTableResponse.ts       # …
│   │   ├─ SetMeal.ts              # SetMeal (套餐) 介面定義
│   │   └─ TableInfo.ts            # TableInfo (桌位) 介面定義
│   │
│   ├─ utils/                     # 工具函式 (Utility functions)，例如：日期時間格式化、串接函式等等
│   │   └─ dateTimeUtils.ts       # 處理時間格式、字串轉換等共用工具
│   │
│   ├─ App.css                    # 全域 CSS（如果有額外自訂）
│   ├─ App.tsx                    # React 根元件 (Root Component)。負責載入「路由 (Routes)」和全域 Context Provider
│   ├─ index.css                  # 全域基底樣式 (通常搭配 Tailwind 或 Reset CSS)
│   ├─ main.tsx                   # React entry point，將 App.tsx 掛載到 index.html 的 #root
│   └─ vite-env.d.ts              # Vite 專用的型別宣告 (不需手動修改)
│
├─ .gitignore                     # Git 忽略規則 (node_modules、build 資料夾、.env 等)
├─ eslint.config.js               # ESLint 設定檔，規範程式碼風格
├─ index.html                     # 前端應用程式的 HTML 範本，Vite 會把編譯後的 JS、CSS 插入到這裡
├─ package.json                   # npm 套件資訊與腳本 (scripts)、專案名稱、依賴套件列表
├─ package-lock.json              # 鎖定版本的套件資訊（自動產生）
├─ README.md                      # 專案說明文件
├─ tailwind.config.js             # Tailwind CSS 設定檔 (自訂顏色、斷點、插件等等)
├─ tsconfig.app.json              # TypeScript 專案設定 (React/Client-Side)
├─ tsconfig.json                  # 通用 TypeScript 設定
├─ tsconfig.node.json             # Node.js 執行環境下 TypeScript 設定
└─ vite.config.ts                 # Vite 架構設定 (alias、Server proxy、plugins 等)
```


##後端架構概述
```text
restaurant-backend/
│
├─ .gradle/                       # Gradle 本地快取與設定目錄（自動產生）
├─ .settings/                     # Eclipse/IDE 設定檔（若你使用 Eclipse 或相關 IDE）
├─ bin/                           # 可執行檔或腳本（通常由 Gradle 產生）
├─ build/                         # Gradle build 輸出（編譯後的 classes、JAR、報告等）
├─ gradle/                        # Gradle Wrapper 相關檔案（自動產生）
│    ├─ wrapper/                  
│    └─ …                         
├─ src/                           # 原始程式碼與資源
│   ├─ main/                      # 生產環境程式與資源
│   │   ├─ java/                  # Java 原始碼入口
│   │   │   └─ tw/                 
│   │   │       └─ cgu/            
│   │   │           └─ restaurant/ 
│   │   │               └─ restaurant_backend/  
│   │   │                   ├─ model/               
│   │   │                   │   ├─ Customer.java         # 客戶實體 (Entity)  
│   │   │                   │   ├─ Dish.java             # 菜品實體 (Entity)  
│   │   │                   │   ├─ OrderDetails.java     # 訂單明細實體  
│   │   │                   │   ├─ OrderInfo.java        # 訂單總表實體  
│   │   │                   │   ├─ SetDish.java          # 「套餐內菜品」實體 (關聯設定)  
│   │   │                   │   ├─ SetDishKey.java       # 複合主鍵 (Composite Key) for SetDish  
│   │   │                   │   ├─ SetMeal.java          # 套餐實體 (Entity)  
│   │   │                   │   └─ TableInfo.java        # 桌位實體 (Entity)  
│   │   │                   │
│   │   │                   ├─ repository/            
│   │   │                   │   ├─ CustomerRepository.java    # Spring Data JPA Repository (Customer)  
│   │   │                   │   ├─ DishRepository.java        # Repository (Dish)  
│   │   │                   │   ├─ OrderDetailsRepository.java# Repository (OrderDetails)  
│   │   │                   │   ├─ OrderInfoRepository.java   # Repository (OrderInfo)  
│   │   │                   │   ├─ SetDishRepository.java     # Repository (SetDish)  
│   │   │                   │   ├─ SetMealRepository.java     # Repository (SetMeal)  
│   │   │                   │   └─ TableInfoRepository.java   # Repository (TableInfo)  
│   │   │                   │
│   │   │                   ├─ RestaurantBackendApplication.java  # Spring Boot 啟動主類  
│   │   │                   └─ RestConfig.java                     # REST/跨域(CORS) 或其他配置  
│   │   │
│   │   ├─ resources/            # 非程式資源（application.properties、靜態檔等）
│   │   │   ├─ application.properties   # Spring Boot 設定 (資料庫連線、JPA 等)  
│   │   │   ├─ static/                   # 靜態資源 (若有)  
│   │   │   └─ templates/                # Thymeleaf 或其他模板 (若有)  
│   │   │
│   │   └─ test/                 # 單元測試程式碼 (JUnit、Mockito 等)
│   │       └─ …                 
│   │
│   └─ …                         
│
├─ .classpath                     # Eclipse 專案設定檔 (自動產生)  
├─ .gitattributes                 # Git 屬性設定  
├─ .gitignore                     # Git 忽略規則 (target、.gradle、.idea 等)  
├─ .project                        # Eclipse 專案描述檔 (自動產生)  
├─ build.gradle                   # Gradle build 腳本 (相依、plugins、task 等)  
├─ gradlew                         # Gradle Wrapper Unix/Linux 執行檔  
├─ gradlew.bat                     # Gradle Wrapper Windows 執行檔  
├─ HELP.md                         # Gradle Wrapper 文件 (自動產生)  
├─ settings.gradle                # Gradle 設定檔 (含專案名稱)  
└─ .gitattributes                 # Git 屬性設定（同 .gitattributes；有時候 IDE 也會產生相同檔名）  
```

## 資料庫架構
```text
## 資料需求（Data Requirements） --

以下定義了系統中各主要實體（Entity）所需的欄位、唯一性約束，以及它們之間的關係。這部分可直接放在 README 或系統設計文件中，作為資料庫規劃的依據。 --

--- --

### 1. 單點 (Dish) --

- **說明**  --  
  系統中的單點菜品，每一筆記錄代表一道可單獨選購的餐點。 --

- **資料表名稱**  --  
  `Dish` --

- **欄位定義**  --  
  | 欄位名稱            | 資料型別                | 約束                                                        | 備註                                 |  --  
  | ------------------- | ----------------------- | ----------------------------------------------------------- | ------------------------------------ |  --  
  | `dNo`               | `BIGINT`（或 `INT`）     | PRIMARY KEY, NOT NULL, AUTO_INCREMENT                       | 單點編號（主鍵，自動遞增）             |  --  
  | `dName`             | `VARCHAR(100)`          | NOT NULL, UNIQUE                                            | 單點名稱，必須唯一                     |  --  
  | `dDesc`             | `TEXT`                  |                                                             | 單點敘述，可不限長度                   |  --  
  | `dPrice`            | `DECIMAL(10,2)`         | NOT NULL                                                    | 單點價格                             |  --  
  | `dType`             | `VARCHAR(50)`           | NOT NULL                                                    | 類別，例如「主菜」、「小吃」、「飲料」等   |  --  
  | `created_at` (可選) | `TIMESTAMP`             | DEFAULT CURRENT_TIMESTAMP                                   | 紀錄新增時間，可作為審計用途            |  --  
  | `updated_at` (可選) | `TIMESTAMP`             | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       | 紀錄最後更新時間                       |  --

- **建立 SQL 範例**  --  
  ```sql --
  CREATE TABLE Dish ( --
    dNo BIGINT AUTO_INCREMENT PRIMARY KEY, --
    dName VARCHAR(100) NOT NULL UNIQUE, --
    dDesc TEXT, --
    dPrice DECIMAL(10,2) NOT NULL, --
    dType VARCHAR(50) NOT NULL, --
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP --
  ); --
  ``` --

---

### 2. 套餐 (SetMeal) --

- **說明**  --  
  一套套餐通常由多道單點組成，系統需記錄哪幾道單點包含在此套餐，以及套餐的售價等資訊。 --

- **資料表名稱**  --  
  `SetMeal` --

- **欄位定義**  --  
  | 欄位名稱            | 資料型別                | 約束                                                        | 備註                                 |  --  
  | ------------------- | ----------------------- | ----------------------------------------------------------- | ------------------------------------ |  --  
  | `sNo`               | `BIGINT`（或 `INT`）     | PRIMARY KEY, NOT NULL, AUTO_INCREMENT                       | 套餐編號（主鍵，自動遞增）             |  --  
  | `sName`             | `VARCHAR(100)`          | NOT NULL, UNIQUE                                            | 套餐名稱，必須唯一                     |  --  
  | `sDesc`             | `TEXT`                  |                                                             | 套餐敘述                             |  --  
  | `sPrice`            | `DECIMAL(10,2)`         | NOT NULL                                                    | 套餐價格                             |  --  
  | `created_at` (可選) | `TIMESTAMP`             | DEFAULT CURRENT_TIMESTAMP                                   | 紀錄新增時間                         |  --  
  | `updated_at` (可選) | `TIMESTAMP`             | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       | 紀錄最後更新時間                       |  --

- **建立 SQL 範例**  --  
  ```sql --
  CREATE TABLE SetMeal ( --
    sNo BIGINT AUTO_INCREMENT PRIMARY KEY, --
    sName VARCHAR(100) NOT NULL UNIQUE, --
    sDesc TEXT, --
    sPrice DECIMAL(10,2) NOT NULL, --
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP --
  ); --
  ``` --

---

#### 2.1 套餐內容對應 (SetDish) --

- **說明**  --  
  由於一個套餐 (SetMeal) 會包含多道單點 (Dish)，需一張關聯表來記錄「哪個套餐包含哪些單點」以及「該單點在套餐中出現多少份」。 --

- **資料表名稱**  --  
  `SetDish` --

- **欄位定義**  --  
  | 欄位名稱     | 資料型別     | 約束                             | 備註                          |  --  
  | ------------ | ------------ | -------------------------------- | ----------------------------- |  --  
  | `sNo`        | `BIGINT`     | NOT NULL                         | 外鍵，參照 `SetMeal(sNo)`      |  --  
  | `dNo`        | `BIGINT`     | NOT NULL                         | 外鍵，參照 `Dish(dNo)`         |  --  
  | `quantity`   | `INT`        | NOT NULL, DEFAULT 1             | 該單點在套餐中的數量            |  --

- **複合主鍵 / 唯一性**  --  
  建議將 `(sNo, dNo)` 作為複合主鍵，保證同一個套餐不能重複記錄同一道菜。例如：  --  
  ```sql --
  CREATE TABLE SetDish ( --
    sNo BIGINT NOT NULL, --
    dNo BIGINT NOT NULL, --
    quantity INT NOT NULL DEFAULT 1, --
    PRIMARY KEY (sNo, dNo), --
    FOREIGN KEY (sNo) REFERENCES SetMeal(sNo), --
    FOREIGN KEY (dNo) REFERENCES Dish(dNo) --
  ); --
  ``` --

---

### 3. 餐桌 (TableInfo) --

- **說明**  --  
  系統須管理餐廳內所有餐桌 (Table)，包含每張桌能容納多少人及該桌的位置 (例如：窗邊、包廂等)。 --

- **資料表名稱**  --  
  `TableInfo` --

- **欄位定義**  --  
  | 欄位名稱            | 資料型別                   | 約束                                                        | 備註                                |  --  
  | ------------------- | -------------------------- | ----------------------------------------------------------- | ----------------------------------- |  --  
  | `tId`               | `BIGINT`（或 `INT`）        | PRIMARY KEY, NOT NULL, AUTO_INCREMENT                       | 餐桌編號（主鍵，自動遞增）            |  --  
  | `capacity`          | `INT`                      | NOT NULL                                                    | 容納人數                            |  --  
  | `location`          | `VARCHAR(100)`             | NOT NULL                                                    | 桌位位置（如：靠窗、包廂、戶外等）    |  --  
  | `status` (可選)     | `ENUM('AVAILABLE','OCCUPIED','RESERVED')` | NOT NULL DEFAULT 'AVAILABLE'                  | 若需即時紀錄桌位狀態，可加此欄        |  --  
  | `created_at` (可選) | `TIMESTAMP`                | DEFAULT CURRENT_TIMESTAMP                                   | 紀錄新增時間                         |  --  
  | `updated_at` (可選) | `TIMESTAMP`                | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       | 紀錄最後更新時間                       |  --

- **建立 SQL 範例**  --  
  ```sql --
  CREATE TABLE TableInfo ( --
    tId BIGINT AUTO_INCREMENT PRIMARY KEY, --
    capacity INT NOT NULL, --
    location VARCHAR(100) NOT NULL, --
    status ENUM('AVAILABLE','OCCUPIED','RESERVED') NOT NULL DEFAULT 'AVAILABLE', --
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP --
  ); --
  ``` --

---

### 4. 顧客 (Customer) --

- **說明**  --  
  系統中的顧客基本資訊，包括姓名與電話，訂單需要關聯到對應顧客。 --

- **資料表名稱**  --  
  `Customer` --

- **欄位定義**  --  
  | 欄位名稱     | 資料型別           | 約束                                  | 備註                                  |  --  
  | ------------ | ------------------ | ------------------------------------- | ------------------------------------- |  --  
  | `cId`        | `BIGINT`（或 `INT`）| PRIMARY KEY, NOT NULL, AUTO_INCREMENT | 顧客編號（主鍵，自動遞增）              |  --  
  | `cName`      | `VARCHAR(100)`     | NOT NULL                              | 顧客姓名                               |  --  
  | `cPhone`     | `VARCHAR(20)`      | NOT NULL, UNIQUE                      | 顧客電話 (必須唯一)                    |  --  
  | `email` (可選)| `VARCHAR(100)`    |                                        | 顧客 Email（如需）                     |  --  
  | `created_at` (可選)| `TIMESTAMP`   | DEFAULT CURRENT_TIMESTAMP             | 紀錄新增時間                           |  --  
  | `updated_at` (可選)| `TIMESTAMP`   | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 紀錄最後更新時間         |  --

- **建立 SQL 範例**  --  
  ```sql --
  CREATE TABLE Customer ( --
    cId BIGINT AUTO_INCREMENT PRIMARY KEY, --
    cName VARCHAR(100) NOT NULL, --
    cPhone VARCHAR(20) NOT NULL UNIQUE, --
    email VARCHAR(100), --
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP --
  ); --
  ``` --

---

### 5. 訂單 (OrderInfo) --

- **說明**  --  
  每次顧客下單所產生的訂單表頭 (OrderInfo)，包括訂單編號、訂單時間、總金額及付款狀態，並關聯到顧客與餐桌（若是內用訂單）。 --

- **資料表名稱**  --  
  `OrderInfo` --

- **欄位定義**  --  
  | 欄位名稱            | 資料型別                                 | 約束                                                        | 備註                                      |  --  
  | ------------------- | ---------------------------------------- | ----------------------------------------------------------- | ----------------------------------------- |  --  
  | `oId`               | `BIGINT`（或 `INT`）                      | PRIMARY KEY, NOT NULL, AUTO_INCREMENT                       | 訂單編號（主鍵，自動遞增）                  |  --  
  | `oDateTime`         | `DATETIME`                               | NOT NULL, DEFAULT CURRENT_TIMESTAMP                         | 訂單日期時間                              |  --  
  | `totalPrice`        | `DECIMAL(10,2)`                          | NOT NULL                                                    | 訂單總金額                                |  --  
  | `payStatus`         | `ENUM('PAID','UNPAID','CANCELLED')`      | NOT NULL DEFAULT 'UNPAID'                                   | 付款狀態                                  |  --  
  | `cId`               | `BIGINT`                                 | NOT NULL                                                    | 外鍵，參照 `Customer(cId)`                 |  --  
  | `tId` (可選)        | `BIGINT`                                 |                                                             | 外鍵，參照 `TableInfo(tId)`（若內用）       |  --  
  | `created_at` (可選) | `TIMESTAMP`                              | DEFAULT CURRENT_TIMESTAMP                                   | 紀錄新增時間                               |  --  
  | `updated_at` (可選) | `TIMESTAMP`                              | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP       | 紀錄最後更新時間                           |  --

- **建立 SQL 範例**  --  
  ```sql --
  CREATE TABLE OrderInfo ( --
    oId BIGINT AUTO_INCREMENT PRIMARY KEY, --
    oDateTime DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP, --
    totalPrice DECIMAL(10,2) NOT NULL, --
    payStatus ENUM('PAID','UNPAID','CANCELLED') NOT NULL DEFAULT 'UNPAID', --
    cId BIGINT NOT NULL, --
    tId BIGINT, --
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, --
    FOREIGN KEY (cId) REFERENCES Customer(cId), --
    FOREIGN KEY (tId) REFERENCES TableInfo(tId) --
  ); --
  ``` --

---

### 6. 訂單明細 (OrderDetails) --

- **說明**  --  
  記錄每個訂單中所點的單點或套餐、數量與小計。若訂單中同時可以包含單點與套餐，可在此表使用兩個外鍵分別對應 `Dish` 或 `SetMeal`，並由其中一個外鍵為 `NULL` 判斷該筆是單點或套餐。 --

- **資料表名稱**  --  
  `OrderDetails` --

- **欄位定義**  --  
  | 欄位名稱            | 資料型別                  | 約束                                                         | 備註                                           |  --  
  | ------------------- | ------------------------- | ------------------------------------------------------------ | ---------------------------------------------- |  --  
  | `odId`              | `BIGINT`（或 `INT`）       | PRIMARY KEY, NOT NULL, AUTO_INCREMENT                        | 訂單明細編號（主鍵，自動遞增）                  |  --  
  | `oId`               | `BIGINT`                  | NOT NULL                                                     | 外鍵，參照 `OrderInfo(oId)`                    |  --  
  | `dNo` (可選)        | `BIGINT`                  |                                                              | 外鍵，參照 `Dish(dNo)`（如果是單點）            |  --  
  | `sNo` (可選)        | `BIGINT`                  |                                                              | 外鍵，參照 `SetMeal(sNo)`（如果是套餐）         |  --  
  | `quantity`          | `INT`                     | NOT NULL                                                     | 該單點或套餐的數量                             |  --  
  | `unitPrice`         | `DECIMAL(10,2)`           | NOT NULL                                                     | 單價 (套餐為套餐價格；單點為單點價格)             |  --  
  | `subTotal`          | `DECIMAL(10,2)`           | NOT NULL, AS (quantity * unitPrice) STORED                   | 小計 (quantity × unitPrice)                    |  --  
  | `created_at` (可選) | `TIMESTAMP`               | DEFAULT CURRENT_TIMESTAMP                                    | 明細建立時間                                   |  --  
  | `updated_at` (可選) | `TIMESTAMP`               | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP        | 明細最後更新時間                               |  --

- **外鍵 & 唯一性**  --  
  - 多對一：多筆 `OrderDetails` 對應同一筆 `OrderInfo` (`oId`)。  --  
  - 一筆明細要麼是單點 (`dNo` 不為 NULL, `sNo` 為 NULL)，要麼是套餐 (`sNo` 不為 NULL, `dNo` 為 NULL)。  --  
  - 若要保證同一張訂單不重複記錄同一筆單點/套餐，可加上唯一性限制：  --  
    ```sql --
    UNIQUE KEY ux_order_item (oId, dNo, sNo) --
    ```  
    其中 `dNo` 和 `sNo` 互斥，實際上也可改為兩種子表設計，但此處採單一表。  --

- **建立 SQL 範例**  --  
  ```sql --
  CREATE TABLE OrderDetails ( --
    odId BIGINT AUTO_INCREMENT PRIMARY KEY, --
    oId BIGINT NOT NULL, --
    dNo BIGINT DEFAULT NULL, --
    sNo BIGINT DEFAULT NULL, --
    quantity INT NOT NULL, --
    unitPrice DECIMAL(10,2) NOT NULL, --
    subTotal DECIMAL(10,2) AS (quantity * unitPrice) STORED, --
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, --
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, --
    FOREIGN KEY (oId) REFERENCES OrderInfo(oId), --
    FOREIGN KEY (dNo) REFERENCES Dish(dNo), --
    FOREIGN KEY (sNo) REFERENCES SetMeal(sNo), --
    UNIQUE KEY ux_order_item (oId, dNo, sNo) --
  ); --
  ``` --

---
```

## 資料關係（ER 概覽）
```
Customer (cId) 1 ────< OrderInfo (oId) >───────< OrderDetails (odId) >─── 0..1 Dish (dNo)
                                         │
                                         │
                                         │
                                         └─── 0..1 SetMeal (sNo)
     
OrderInfo (oId) 0..1 ────> TableInfo (tId)

SetMeal (sNo) 1 ────< SetDish (sNo, dNo) >─── 1 Dish (dNo)



1. **Customer ↔ OrderInfo**  --  
   - 一位顧客（Customer）可擁有多筆訂單（OrderInfo）。  --  
   - `OrderInfo.cId` 為外鍵，參照 `Customer(cId)`。  --

2. **OrderInfo ↔ TableInfo**（內用）  --  
   - 一筆訂單可關聯至一張餐桌 (`tId`)，若外帶則不關聯。  --  
   - `OrderInfo.tId` 為外鍵，參照 `TableInfo(tId)`。  --

3. **OrderInfo ↔ OrderDetails**  --  
   - 一筆訂單 (`OrderInfo`) 可包含多筆訂單明細 (`OrderDetails`)。  --  
   - `OrderDetails.oId` 為外鍵，參照 `OrderInfo(oId)`。  --

4. **OrderDetails ↔ Dish / SetMeal**  --  
   - 若顧客單點一個菜品，則 `OrderDetails.dNo` 指向 `Dish(dNo)`；此時 `sNo` 為 `NULL`。  --  
   - 若顧客點套餐，則 `OrderDetails.sNo` 指向 `SetMeal(sNo)`；此時 `dNo` 為 `NULL`。  --  
   - 同一筆明細不會同時有 `dNo`、`sNo` 皆不為 NULL。  --

5. **SetMeal ↔ SetDish ↔ Dish**  --  
   - 多對多：一個套餐 (`SetMeal`) 可由多道單點 (`Dish`) 組成；一個單點 (`Dish`) 也可出現在多個套餐中。  --  
   - 關聯表 `SetDish (sNo, dNo, quantity)`：  --  
     - `SetDish.sNo` 外鍵指向 `SetMeal(sNo)`  --  
     - `SetDish.dNo` 外鍵指向 `Dish(dNo)`  --  
     - `quantity` 記錄該套餐內某道菜的數量  --

---

### 小結  --  
- 所有「唯一性」需求均已在各表中以 `PRIMARY KEY` 或 `UNIQUE` 強制：  --  
  - `Dish(dNo)`, `Dish(dName)` 均唯一  --  
  - `SetMeal(sNo)`, `SetMeal(sName)` 均唯一  --  
  - `TableInfo(tId)` 唯一  --  
  - `Customer(cId)`, `Customer(cPhone)` 均唯一  --  
  - `OrderInfo(oId)` 唯一  --  

- **關聯（Foreign Keys）** － 強化資料完整性：  --  
  1. `OrderInfo.cId → Customer(cId)`  --  
  2. `OrderInfo.tId → TableInfo(tId)`  --  
  3. `OrderDetails.oId → OrderInfo(oId)`  --  
  4. `OrderDetails.dNo → Dish(dNo)` 或 `OrderDetails.sNo → SetMeal(sNo)`  --  
  5. `SetDish.sNo → SetMeal(sNo)`, `SetDish.dNo → Dish(dNo)`  --



```


