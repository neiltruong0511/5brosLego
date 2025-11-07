import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";

const Error404 = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    createdAt: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchUserProfile = async () => {
    try {
      const res = await api.get("/users/profile"); // Backend cần có endpoint này
      setProfile({
        name: res.data.name || "Chưa cập nhật",
        email: res.data.email || "Chưa có email",
        phone: res.data.phone || "Chưa có số điện thoại",
        address: res.data.address || "Chưa có địa chỉ",
        createdAt: new Date(res.data.createdAt).toLocaleDateString(),
      });
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10 text-gray-700">Đang tải thông tin...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-[#e60000] mb-3">
          Bạn chưa đăng nhập
        </h2>
        <p className="text-gray-600">Vui lòng đăng nhập để xem thông tin tài khoản.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef9f4] text-[#3d1f00] p-6">
      <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#e60000]">
          Thông tin tài khoản
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Họ và tên</label>
            <input
              type="text"
              value={profile.name}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Số điện thoại</label>
            <input
              type="text"
              value={profile.phone}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Địa chỉ</label>
            <input
              type="text"
              value={profile.address}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Ngày tạo tài khoản</label>
            <input
              type="text"
              value={profile.createdAt}
              disabled
              className="w-full p-2 border rounded bg-gray-100"
            />
          </div>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => alert("Chức năng chỉnh sửa sẽ có trong bản sau!")}
            className="bg-[#e60000] hover:bg-[#b30000] text-white py-2 px-6 rounded-full transition duration-200 shadow-md"
          >
            Chỉnh sửa thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default Error404;
