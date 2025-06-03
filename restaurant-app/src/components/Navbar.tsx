// src/components/Navbar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";

const Navbar: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isClientRoute = location.pathname.startsWith("/client") && location.pathname !== '/client'; // Exclude role selection page from general client routes for link display
  const isRoleSelectionPage = location.pathname === '/client';
  const isLoginPage = location.pathname === '/admin/login'; // Check for login page

  // Determine if any nav links should be shown
  const showNavLinks = !isRoleSelectionPage && !isLoginPage;

  return (
    <nav className="bg-primary text-white py-5">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold font-heading">
          餐廳管理系統
        </Link>

        {/* Only show nav links if not on role selection or login page */}
        {showNavLinks && (
          <div className="space-x-4">
            {isClientRoute && (
              <>
                <Link to="/client/welcome" className="hover:text-accent">
                  首頁
                </Link>
                <Link to="/client/menu" className="hover:text-accent">
                  菜單
                </Link>
                <Link to="/client/cart" className="hover:text-accent">
                  購物車
                </Link>
              </>
            )}
            {isAdminRoute && (
              <>
                <Link to="/admin" className="hover:text-accent">
                  儀表板
                </Link>
                <Link to="/admin/dishes" className="hover:text-accent">
                  單點管理
                </Link>
                <Link to="/admin/sets" className="hover:text-accent">
                  套餐管理
                </Link>
                <Link to="/admin/tables" className="hover:text-accent">
                  餐桌管理
                </Link>
                <Link to="/admin/orders" className="hover:text-accent">
                  訂單管理
                </Link>
                <Link to="/admin/customers" className="hover:text-accent">
                  顧客管理
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
