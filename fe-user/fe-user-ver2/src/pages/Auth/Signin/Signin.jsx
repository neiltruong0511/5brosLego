import React, { useState } from "react";
import { Link } from "react-router-dom";
import bgImage from "../../../assets/background.jpg";

const Signin = () => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, agree } = form;

    if (!agree) {
      alert("Bạn cần đồng ý với điều khoản");
      return;
    }
    if (password !== confirmPassword) {
      alert("Mật khẩu xác nhận không khớp");
      return;
    }

    // Giả lập chuyển trang sau đăng ký thành công
    window.location.href = "/login";
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-lg bg-white bg-opacity-50 p-8 rounded-2xl shadow-lg backdrop-blur-md">
        <h1 className="text-3xl font-bold text-center mb-4">Đăng ký WOLSOM</h1>
        <p className="text-center text-sm text-[#a35a2a] mb-6">
          Trở thành Hội Viên Wolsom để nhận nhiều ưu đãi hấp dẫn!
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Họ và tên*"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#d4bfae] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c29669] transition"
          />
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#d4bfae] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c29669] transition"
          />
          <input
            type="password"
            name="password"
            placeholder="Mật khẩu*"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#d4bfae] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c29669] transition"
          />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Xác nhận mật khẩu*"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full p-3 border border-[#d4bfae] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c29669] transition"
          />
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
              required
              className="accent-[#c29669]"
            />
            <span>Tôi đồng ý với các điều khoản và điều kiện</span>
          </label>
          <button
            type="submit"
            className="w-full bg-[#c29669] text-white font-bold py-3 rounded-lg hover:bg-[#a9794c] transition shadow-md"
          >
            Đăng ký ngay
          </button>
        </form>
        <p className="mt-6 text-sm text-center">
          Bạn đã có tài khoản?{" "}
          <Link to="/login" className="text-[#a35a2a] hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;