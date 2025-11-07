import React, { useState, useEffect } from "react";
// Import các hình ảnh cho nút chuyển chế độ tối và sáng
import darkPng from "../../assets/website/dark-mode-button.png";
import lightPng from "../../assets/website/light-mode-button.png";

const DarkMode = () => {
  // Khởi tạo state để quản lý chủ đề hiện tại (sáng hoặc tối).
  // Nếu có chủ đề đã được lưu trong localStorage, nó sẽ được lấy ra, nếu không thì mặc định là "sáng".
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"
  );

  // Tham chiếu đến phần tử HTML gốc để thêm hoặc xóa lớp dark.
  const element = document.documentElement;

  // Hook useEffect sẽ chạy khi component được mount hoặc khi theme thay đổi.
  useEffect(() => {
    if (theme === "dark") {
      // Thêm lớp "dark" vào phần tử gốc để áp dụng các style chế độ tối
      element.classList.add("dark");
      // Lưu chủ đề hiện tại vào localStorage để nó không bị mất khi tải lại trang
      localStorage.setItem("theme", "dark");
    } else {
      // Xóa lớp "dark" khi chuyển lại chế độ sáng
      element.classList.remove("dark");
      // Lưu chủ đề hiện tại vào localStorage
      localStorage.setItem("theme", "light");
    }
  }, [theme]); // Mảng phụ thuộc giúp useEffect chạy khi state "theme" thay đổi

  return (
    <>
      {/* Div bọc bên ngoài để chứa các nút chuyển chế độ */}
      <div className="relative">
        {/* Nút chế độ sáng */}
        <img
          // Chọn hình ảnh nguồn dựa trên chủ đề hiện tại
          // Nút "chế độ sáng" sẽ hiển thị khi chủ đề hiện tại là tối
          // (vì chế độ tối sẽ bị ẩn đi bằng opacity-0)
          src={lightPng}
          alt="light"
          // Khi người dùng nhấn vào nút này, nó sẽ chuyển đổi giữa chế độ tối và sáng
          onClick={() =>
            setTheme((data) => (data === "dark" ? "light" : "dark"))
          }
          // Styling cho nút với hiệu ứng chuyển tiếp và thay đổi độ mờ
          className={`w-12 cursor-pointer drop-shadow-[1px_1px_1px_rgba(0,0,0,0.1)] transition-all duration-300 absolute right-0 z-10  ${
            theme === "dark" ? "opacity-0" : "opacity-100"
          } `}
        />
        
        {/* Nút chế độ tối */}
        <img
          // Hình ảnh nút chế độ tối
          src={darkPng}
          alt="dark"
          // Khi người dùng nhấn vào nút này, nó sẽ chuyển đổi giữa chế độ tối và sáng
          onClick={() =>
            setTheme((data) => (data === "dark" ? "light" : "dark"))
          }
          // Styling cho nút chế độ tối với hiệu ứng đổ bóng
          className="w-12 cursor-pointer drop-shadow-[1px_1px_2px_rgba(0,0,0,0.5)] duration-300 "
        />
      </div>
    </>
  );
};

export default DarkMode;
