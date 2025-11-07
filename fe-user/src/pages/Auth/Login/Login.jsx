import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import api from "../../../services/api";
import logo from "../../../assets/lego.png";
import bgImage from "../../../assets/bannerlegoo.png";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (values) => {
    try {
      const response = await api.post("/users/login", values);
      login(response.data);
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.response?.data?.message || "Đăng nhập thất bại");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(formData);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div
        className="flex flex-col md:flex-row items-center justify-between 
                   w-full max-w-7xl shadow-lg rounded-3xl overflow-hidden 
                   bg-white bg-opacity-50 px-16 py-8"
        style={{ height: "550px" }}
      >
        {/* Logo section */}
        <div className="md:w-[55%] mb-10 md:mb-0 px-6">
          <div className="flex items-center justify-center md:justify-start">
            <div className="w-[180px] h-[180px] overflow-hidden rounded-full shadow-md border border-[#e0d2c1]">
              <img
                src={logo}
                alt="logo"
                className="object-contain w-full h-full scale-110"
              />
            </div>
            <p className="ml-8 text-6xl font-bold text-[#3a2e26]">5BROSLEGO</p>
          </div>
        </div>

        {/* Form section */}
        <form
          onSubmit={handleSubmit}
          className="w-full md:w-[45%] bg-[#fff9f3] p-10 rounded-2xl border border-[#ecdccf] shadow-inner"
        >
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Đăng nhập vào tài khoản
          </h2>
          {error && <div className="mb-4 text-red-500 text-center">{error}</div>}
          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-[#d4bfae] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] transition"
            />
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-[#d4bfae] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ff4d4d] transition"
            />
            <button
              type="submit"
              className="w-full bg-[#e60000] text-white font-bold py-3 rounded-lg hover:bg-[#b30000] transition shadow-md"
            >
              Đăng nhập
            </button>
          </div>
          <p className="mt-6 text-sm text-center">
            Bạn chưa có tài khoản?{" "}
            <Link to="/signin" className="text-[#e60000] hover:underline font-semibold">
              Đăng ký
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
