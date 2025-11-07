import React, { useState, useEffect } from "react";

const Settings = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [appSettings, setAppSettings] = useState({
    theme: "light", // Mặc định là giao diện sáng
    notifications: true,
  });

  // Thay đổi lớp giao diện khi theme thay đổi
  useEffect(() => {
    if (appSettings.theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [appSettings.theme]);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleAppSettingsChange = (e) => {
    const { name, type, checked, value } = e.target;
    setAppSettings({
      ...appSettings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSaveSettings = () => {
    alert("Cài đặt đã được lưu thành công!");
  };

  return (
    <div className="bg-[#fdf8f0] dark:bg-gray-800 dark:text-white p-6 min-h-screen">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold text-[#3d1f00] dark:text-white mb-6">Cài Đặt</h1>

      {/* Thông tin tài khoản */}
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-4 mb-6 border border-[#3d1f00] dark:border-gray-600">
        <h2 className="text-xl font-semibold text-[#3d1f00] dark:text-white mb-4">Thông Tin Tài Khoản</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="name"
            value={userInfo.name}
            onChange={handleUserInfoChange}
            placeholder="Họ và Tên"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a4b27] dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-300"
          />
          <input
            type="email"
            name="email"
            value={userInfo.email}
            onChange={handleUserInfoChange}
            placeholder="Email"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a4b27] dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-300"
          />
          <input
            type="password"
            name="password"
            value={userInfo.password}
            onChange={handleUserInfoChange}
            placeholder="Mật Khẩu Mới"
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a4b27] dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-300"
          />
        </div>
      </div>

      {/* Cài đặt ứng dụng */}
      <div className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-4 mb-6 border border-[#3d1f00] dark:border-gray-600">
        <h2 className="text-xl font-semibold text-[#3d1f00] dark:text-white mb-4">Cài Đặt Ứng Dụng</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="theme" className="text-[#3d1f00] dark:text-white font-medium">
              Giao Diện
            </label>
            <select
              id="theme"
              name="theme"
              value={appSettings.theme}
              onChange={handleAppSettingsChange}
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#7a4b27] dark:bg-gray-600 dark:border-gray-500"
            >
              <option value="light">Sáng</option>
              <option value="dark">Tối</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label htmlFor="notifications" className="text-[#3d1f00] dark:text-white font-medium">
              Bật Thông Báo
            </label>
            <input
              type="checkbox"
              id="notifications"
              name="notifications"
              checked={appSettings.notifications}
              onChange={handleAppSettingsChange}
              className="w-5 h-5"
            />
          </div>
        </div>
      </div>

      {/* Nút lưu */}
      <button
        onClick={handleSaveSettings}
        className="bg-[#3d1f00] text-white px-6 py-2 rounded-md hover:bg-[#7a4b27] transition"
      >
        Lưu Cài Đặt
      </button>
    </div>
  );
};

export default Settings;