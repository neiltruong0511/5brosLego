import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../../assets/bannerlegoo.png";
import api from "../../../services/api";

const Signin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, agree } = form;

    if (!agree) {
      setError("Bạn cần đồng ý với điều khoản");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const response = await api.post("/users/register", {
        name,
        email,
        password,
      });

      if (response.data) {
        alert("Đăng ký thành công!");
        navigate("/login");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-lg bg-white bg-opacity-50 p-8 rounded-2xl shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center mb-4">Đăng ký 5BROSLEGO</h1>
        <p className="text-center text-sm text-[#e60000] mb-6">
          Trở thành Hội Viên 5BROSLEGO để nhận nhiều ưu đãi hấp dẫn!
        </p>

        {error && (
          <div className="mb-4 text-red-500 text-center bg-red-100 p-2 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên*"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#d4bfae] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#d4bfae] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu*"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#d4bfae] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] transition"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu*"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#d4bfae] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] transition"
          />

          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              required
              className="accent-[#e60000]"
            />
            <span>Tôi đồng ý với các điều khoản và điều kiện</span>
          </label>

          <button
            type="submit"
            className="w-full bg-[#e60000] text-white font-bold py-3 rounded-lg hover:bg-[#b30000] transition shadow-md"
          >
            Đăng ký ngay
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          Bạn đã có tài khoản?{" "}
          <Link to="/login" className="text-[#e60000] hover:underline font-semibold">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};
export default Signin;
