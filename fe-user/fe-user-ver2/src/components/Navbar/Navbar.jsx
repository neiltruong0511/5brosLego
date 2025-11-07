import React from "react";
// Import logo của website
import Logo from "../../assets/food-logo.png";
// Import biểu tượng giỏ hàng từ react-icons
import { FaCartShopping } from "react-icons/fa6";
// Import component DarkMode cho phép chuyển đổi giữa chế độ sáng và tối
import DarkMode from "./DarkMode";
import { Link } from "react-router-dom";

// Định nghĩa menu bao gồm các mục như Home, Services, About với id và link tương ứng
const menu = [
  {
    id: 1,
    name: "Trang chủ",
    link: "/#",
  },
  {
    id: 2,
    name: "Dịch Vụ",
    link: "/#services",
  },
  {
    id: 3,
    name: "Giới Thiệu",
    link: "/about",
  },
  {
    id: 4,
    name: "Sản Phẩm",
    link: "/product",
  },
];

// Component Navbar
const Navbar = () => {
  return (
    <>
      {/* Phần navbar với hiệu ứng bóng đổ (shadow) và chuyển đổi màu nền khi ở chế độ tối */}
      <div className="h-[80px] flex items-center shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 hover:boder-black">
        <div className="container py-3 sm:py-0">
          <div className="flex justify-between items-center">
            {/* Logo và tên website */}
            <div>
              <a href="#" className="font-bold text-2xl sm:text-3xl flex gap-2">
                {/* Logo */}
                <img src={Logo} alt="Logo" className="w-10 border border-black rounded-full" />
                WOLSOM
              </a>
            </div>

            {/* Phần bên phải Navbar bao gồm nút DarkMode và menu */}
            <div className="flex justify-between items-center gap-4">
              <div>
                {/* Component DarkMode */}
                <DarkMode />
              </div>

              {/* Menu */}
              <ul className="hidden sm:flex items-center gap-4">
                {/* Lặp qua menu và hiển thị các mục */}
                {menu.map((menu) => (
                  <li key={menu.id}>
                    {menu.link === "/about" && menu.link === "/product" ? (
                      <Link
                        to={menu.link}
                        className="inline-block py-4 px-4 hover:text-yellow-500"
                      >
                        {menu.name}
                      </Link>
                    ) : (
                      <a
                        href={menu.link}
                        className="inline-block py-4 px-4 hover:text-yellow-500"
                      >
                        {menu.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>

              {/* Nút Order (Đặt món) với hiệu ứng chuyển đổi màu sắc và phóng to khi hover */}
              <Link
                to="/cart"
                className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3"
              >
                Giỏ Hàng
                {/* Biểu tượng giỏ hàng */}
                <FaCartShopping className="text-xl text-white drop-shadow-sm cursor-pointer" />
              </Link>
              <Link
                to="/login"
                className="bg-gray-800 hover:bg-gray-700 text-white py-1 px-4 rounded-full duration-200"
              >
                Đăng Nhập
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
