import React from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import bgImage from "../assets/background.jpg"; // Kiểm tra lại đường dẫn
const ThankYou = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-white bg-opacity-80 rounded-2xl shadow-lg px-50 py-10 max-w-xl w-full text-center transition-all duration-300 transform ">
        {/* Icon check */}
        <CheckCircle className="w-28 h-28 text-green-600 mx-auto mb-8 animate-bounce" />

        {/* Title */}
        <h1 className="text-5xl font-extrabold text-[#3d1f00] mb-6 font-serif">
          CẢM ƠN QUÝ KHÁCH ĐÃ ĐẶT HÀNG!
        </h1>

        {/* Description */}
        <p className="text-gray-700 text-lg leading-relaxed mb-10 max-w-md mx-auto font-medium">
          Chúng tôi đã nhận được đơn hàng của bạn. Hãy tiếp tục mua sắm hoặc
          chia sẻ đánh giá để giúp người khác hiểu rõ hơn về sản phẩm.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 w-full max-w-md mx-auto justify-center">
          <Link
            to="/product"
            className="bg-gradient-to-r from-[#f1e4d1] to-[#d0b59f] text-[#3d1f00] font-bold px-6 py-3 rounded-full hover:from-[#e8d6c2] hover:to-[#c4a489] transition-all duration-300 ease-in-out w-full sm:w-1/2 shadow-md"
          >
            Quay lại sản phẩm
          </Link>
          <Link
            to="/evaluate"
            className="bg-[#d0b59f] text-white font-bold px-6 py-3 rounded-full hover:bg-[#a68869] transition-all duration-300 ease-in-out w-full sm:w-1/2 shadow-md"
          >
            Đánh giá sản phẩm
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
