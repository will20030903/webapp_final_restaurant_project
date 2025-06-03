// src/client/pages/Home.tsx
import { Link } from "react-router-dom";
import HeroImage from "../../assets/HeroImage.jpeg"; // 請確認路徑與檔名正確

export default function RoleSelectionPage() {
  return (
    <div className="mt-10 flex flex-col items-center text-center px-4">
      {/* 示意圖片 */}
      <img
        src={HeroImage}
        alt="餐廳點餐示意圖"
        className="mb-8 rounded-lg shadow-md max-w-full h-auto md:max-w-md lg:max-w-lg"
      />

      {/* 標題 */}
      <h1 className="text-4xl font-bold mb-4">歡迎光臨 - 線上點餐系統</h1>

      {/* 說明文字 */}
      <p className="text-lg text-gray-700 mb-8 max-w-xl leading-relaxed">
        本系統提供一站式的線上點餐體驗：  
        顧客可以瀏覽完整菜單、將餐點加入購物車，並快速結帳取餐；  
        餐廳管理人員則可透過後台快速新增、編輯菜色，查看訂單與統計報表。  
        請先選擇您的身分，開始使用！
      </p>

      {/* 身分選擇按鈕 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/client/welcome"
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          aria-label="前往顧客閱覽端"
        >
          顧客閱覽端
        </Link>
        <Link
          to="/admin/login"
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
          aria-label="前往餐廳管理端"
        >
          餐廳管理端
        </Link>
      </div>
    </div>
  );
}
