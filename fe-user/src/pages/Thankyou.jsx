import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, ShoppingBag, Home } from "lucide-react"; // Thêm icons
import bgImage from "../assets/bannerlegoo.png";

const ThankYou = () => {
  const orderId = "12345";

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{ 
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${bgImage})` 
      }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl p-8 md:p-16 max-w-4xl w-full text-center transform hover:scale-[1.01] transition-all duration-300">
        {/* Success Animation */}
        <div className="relative mb-8">
          <CheckCircle className="w-28 h-28 text-green-600 mx-auto relative z-10 animate-bounce" />
        </div>

        {/* Title with enhanced styling */}
        <div className="space-y-6 mb-12">
          <h1 className="text-6xl font-extrabold text-[#3d1f00] font-serif tracking-tight">
            CẢM ƠN QUÝ KHÁCH!
          </h1>
          <p className="text-3xl font-medium text-[#6b3f24]">
            Đơn hàng của bạn đã được xác nhận
          </p>
          <div className="h-1.5 w-48 bg-gradient-to-r from-[#d0b59f] via-[#8b5434] to-[#3d1f00] mx-auto rounded-full"></div>
        </div>

        {/* Order Info */}
        <div className="bg-[#f8f3ed] rounded-2xl p-6 mb-12 max-w-2xl mx-auto">
          <p className="text-xl text-gray-700 leading-relaxed font-medium">
            Chúng tôi sẽ gửi email xác nhận đơn hàng và
            thông tin chi tiết về việc giao hàng đến bạn trong thời gian sớm nhất.
          </p>
        </div>

        {/* Enhanced Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-2xl mx-auto justify-center">
          <Link
            to="/"
            className="group relative px-10 py-5 w-full sm:w-1/2 rounded-2xl bg-gradient-to-br from-[#f1e4d1] to-[#d0b59f] text-[#3d1f00] font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#d0b59f] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <span className="flex items-center justify-center gap-3 text-lg">
              <Home className="w-6 h-6" />
              Trang Chủ
            </span>
          </Link>
          
          <Link
            to="/history-order"
            state={{ orderId }}
            className="group relative px-10 py-5 w-full sm:w-1/2 rounded-2xl bg-gradient-to-br from-[#8b5434] to-[#6b3f24] text-white font-bold shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#3d1f00] to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <span className="flex items-center justify-center gap-3 text-lg">
              <ShoppingBag className="w-6 h-6" />
              Xem Đơn Hàng
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;