// src/client/pages/ClientHome.tsx
import React from "react";
import { Link } from "react-router-dom";
import bannerImage from "../../assets/banner.png"; // Import the local image

const ClientHome: React.FC = () => {
  return (
    <div className="text-center mt-10 flex flex-col items-center">
      <img
        src={bannerImage} // Use the imported image
        alt="Restaurant Banner"
        className="mb-8 rounded-lg shadow-md max-w-full h-auto md:max-w-md lg:max-w-lg"
      />
      <h1 className="text-4xl font-bold mb-4">歡迎光臨 - 線上點餐系統</h1>
      <p className="text-lg text-gray-700 mb-8 max-w-xl">
        探索我們多樣化的菜單，包含美味的單點、精選套餐，以及各種飲品和甜點。點擊下方按鈕，立即開始您的美食之旅！
      </p>
      <Link
        to="/client/menu"
        className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-lg text-xl font-semibold shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
      >
        開始點餐
      </Link>
    </div>
  );
};

export default ClientHome;
