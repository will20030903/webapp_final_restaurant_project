// src/App.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Client 端頁面
import RoleSelectionPage from "./client/pages/Home";
import ClientHome from "./client/pages/ClientHome";
import MenuPage from "./client/pages/MenuPage";
import CartPage from "./client/pages/CartPage";
import CheckoutPage from "./client/pages/CheckoutPage";

// Admin 端頁面
import AdminHome from "./admin/pages/AdminHome";
import LoginPage from "./admin/pages/LoginPage";
import DishPage from "./admin/pages/DishPage";
import SetMealPage from "./admin/pages/SetMealPage";
import TablePage from "./admin/pages/TablePage";
import OrderPage from "./admin/pages/OrderPage";
import CustomerPage from "./admin/pages/CustomerPage";

function App() {
  return (
    // 這裡套用淺底或深底
    <div className="min-h-screen bg-background-light">
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          {/* 全站共用 Navbar */}
          <Navbar />

          {/* 主要內容區，讓路由顯示在這裡 */}
          <div className="flex-grow container mx-auto p-4">
            <Routes>
              <Route path="/" element={<Navigate to="/client" replace />} />

              {/* Client 路由 */}
              <Route path="/client">
                <Route index element={<RoleSelectionPage />} />
                <Route path="welcome" element={<ClientHome />} />
                <Route path="menu" element={<MenuPage />} />
                <Route path="cart" element={<CartPage />} />
                <Route path="checkout" element={<CheckoutPage />} />
              </Route>

              {/* Admin 路由 */}
              <Route path="/admin">
                <Route index element={<AdminHome />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="dishes" element={<DishPage />} />
                <Route path="sets" element={<SetMealPage />} />
                <Route path="tables" element={<TablePage />} />
                <Route path="orders" element={<OrderPage />} />
                <Route path="customers" element={<CustomerPage />} />
              </Route>

              {/* 404 */}
              <Route
                path="*"
                element={
                  <div className="py-20 text-center text-gray-500">
                    404 - 找不到頁面
                  </div>
                }
              />
            </Routes>
          </div>

          {/* 全站共用 Footer */}
          <Footer />
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
