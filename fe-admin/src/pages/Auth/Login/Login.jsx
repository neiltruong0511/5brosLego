import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import logo from "../../../assets/lego.png";
import bgImage from "../../../assets/bannerlegoo.png";
import api from "../../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/users/login", formData);
      const userData = response.data;

      // Kiểm tra role của người dùng
      if (userData.role !== "admin") {
        setError("Bạn không có quyền truy cập vào trang quản trị");
        return;
      }

      // Lưu thông tin đăng nhập và chuyển hướng
      login(userData);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Email hoặc mật khẩu không chính xác"
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl shadow-lg rounded-3xl overflow-hidden bg-white bg-opacity-50 p-10">
        {/* Logo + Giới thiệu */}
        <div className="md:w-1/2 mb-10 md:mb-0 px-4">
          <div className="flex items-center justify-center md:justify-start">
            <div className="w-[150px] h-[150px] overflow-hidden rounded-full shadow-md border border-[#e0d2c1]">
              <img src={logo} alt="logo" className="object-cover w-full h-full" />
            </div>
            <p className="ml-6 text-6xl font-bold">5BROSLEGO</p>
          </div>
        </div>

        {/* Form đăng nhập */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-1/2 bg-[#fff9f3] p-8 rounded-2xl border border-[#ecdccf] shadow-inner"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Đăng nhập vào trang quản trị
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full p-3 border border-[#d4bfae] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] transition"
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mật khẩu"
              required
              className="w-full p-3 border border-[#d4bfae] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] transition"
            />
            <button
              type="submit"
              className="w-full bg-[#e60000] text-white font-bold py-3 rounded-lg hover:bg-[#b30000] transition shadow-md"
            >
              Đăng nhập
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
