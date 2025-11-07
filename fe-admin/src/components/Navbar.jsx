import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCog, FaUserCircle } from "react-icons/fa"; 
import { useAuth } from "../contexts/AuthContext";
import Logo from "../assets/lego.png";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#fdf8f0] text-[#3d1f00] p-4 shadow-md border-b border-[#e2d1b5]">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo and Website Name */}
        <div className="flex items-center gap-4">
          <img
            src={Logo}
            alt="Logo"
            className="w-12 h-12 object-cover rounded-full border-4 border-[#3d1f00]"
          />
          <span className="font-bold text-2xl sm:text-3xl text-[#3d1f00]">
            ADMIN 5BROSLEGO
          </span>
        </div>

        {/* Navigation Links and Settings */}
        <div className="flex items-center gap-8">
          {/* Navigation Links */}
          <ul className="flex gap-8 text-lg font-medium items-center">
            <li>
              <Link
                to="/dashboard"
                className="relative hover:text-[#7a4b27] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#7a4b27] after:transition-all after:duration-300 hover:after:w-full"
              >
                Tổng Quan
              </Link>
            </li>
            <li>
              <Link
                to="/customers"
                className="relative hover:text-[#7a4b27] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#7a4b27] after:transition-all after:duration-300 hover:after:w-full"
              >
                Khách Hàng
              </Link>
            </li>
            <li>
              <Link
                to="/products"
                className="relative hover:text-[#7a4b27] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#7a4b27] after:transition-all after:duration-300 hover:after:w-full"
              >
                Sản Phẩm
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className="relative hover:text-[#7a4b27] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-[#7a4b27] after:transition-all after:duration-300 hover:after:w-full"
              >
                Đơn Hàng
              </Link>
            </li>
          </ul>

          {/* User Account or Login Button */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#3d1f00] flex items-center justify-center text-white hover:bg-[#7a4b27] transition">
                    <FaUserCircle className="text-2xl" />
                  </div>
                </button>

                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-50 invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-300">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-semibold text-gray-700">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Cài đặt
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-[#3d1f00] text-white px-4 py-2 rounded-md hover:bg-[#7a4b27] transition"
              >
                Đăng Nhập
              </Link>
            )}

            <Link
              to="/settings"
              className="text-[#3d1f00] text-2xl hover:text-[#7a4b27] transition"
            >
              <FaCog />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;