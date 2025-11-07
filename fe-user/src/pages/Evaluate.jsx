import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import bgImage from "../assets/background.jpg";
import api from "../services/api";

const Evaluate = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url(${bgImage})`
      }}
    >
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12 max-w-2xl w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#3d1f00] mb-2">Đánh giá sản phẩm</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#d0b59f] to-[#3d1f00] mx-auto rounded-full"></div>
        </div>

        {/* Product Info Card */}
        <div className="bg-[#fef9f4] rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <img
              src="product-image-url"
              alt="Product"
              className="w-24 h-24 object-cover rounded-xl"
            />
            <div>
              <h3 className="font-bold text-lg text-[#3d1f00]">Tên sản phẩm</h3>
              <p className="text-gray-600 text-sm">Mã đơn hàng: {orderId}</p>
            </div>
          </div>
        </div>

        {/* Rating Stars */}
        <div className="text-center mb-8">
          <p className="text-gray-600 mb-3">Bạn cảm thấy sản phẩm như thế nào?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                className="transform hover:scale-110 transition-transform"
              >
                <svg
                  className={`w-10 h-10 transition-colors duration-200 ${star <= (hover || rating) ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.518 4.674h4.92c.969 0 1.371 1.24.588 1.81l-3.977 2.89 1.518 4.674c.3.921-.755 1.688-1.54 1.118L10 15.347l-3.977 2.89c-.784.57-1.838-.197-1.539-1.118l1.518-4.674-3.977-2.89c-.783-.57-.38-1.81.588-1.81h4.92l1.518-4.674z" />
                </svg>
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {rating ? `Bạn đã đánh giá ${rating} sao` : 'Chọn số sao để đánh giá'}
          </p>
        </div>

        {/* Review Form */}
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nhận xét của bạn
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
              rows="4"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#d0b59f] focus:border-transparent resize-none bg-[#fef9f4]"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-1/2 px-6 py-3 rounded-full bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="w-1/2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d0b59f] to-[#b78a68] text-white font-medium hover:opacity-90 transition-opacity"
            >
              Gửi đánh giá
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Evaluate;