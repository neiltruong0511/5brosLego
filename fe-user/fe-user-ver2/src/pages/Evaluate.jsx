import React, { useState } from "react";
import bgImage from "../assets/background.jpg"; // Kiểm tra lại đường dẫn
import { Link } from "react-router-dom";

const Evaluate = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="bg-[#fef9f4] text-[#3d1f00] max-w-md w-full p-8 rounded-2xl shadow-xl bg-opacity-90 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-center mb-6">Đánh giá sản phẩm</h2>

        {/* Stars */}
        <div className="flex justify-center mb-4">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            >
              <svg
                className={`w-7 h-7 transition-colors duration-200 ${
                  star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674h4.92c.969 0 1.371 1.24.588 1.81l-3.977 2.89 1.518 4.674c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.977 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674-3.977-2.89c-.783-.57-.38-1.81.588-1.81h4.92l1.518-4.674z" />
              </svg>
            </button>
          ))}
        </div>

        {/* Form */}
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Họ và tên"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a97f6a] bg-white"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a97f6a] bg-white"
          />
          <input
            type="text"
            placeholder="Tiêu đề"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a97f6a] bg-white"
          />
          <textarea
            placeholder="Nội dung"
            rows="4"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#a97f6a] bg-white"
          />
          <button
            type="submit"
            className="bg-[#a97f6a] text-white px-6 py-2 rounded hover:bg-[#926856] transition w-full"
          >
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default Evaluate;
