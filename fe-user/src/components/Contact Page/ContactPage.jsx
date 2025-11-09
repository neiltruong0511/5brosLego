import React, { useState } from "react";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaInstagram, FaYoutube } from "react-icons/fa";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn của bạn.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-yellow-500 drop-shadow-md">
            Liên hệ 5BROSLEGO
          </h1>
          <p className="mt-4 text-gray-700 dark:text-gray-300">
            Chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc và hỗ trợ bạn trong thế giới LEGO đầy màu sắc!
          </p>
        </div>

        {/* Thông tin liên hệ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md text-center">
            <FaMapMarkerAlt className="text-3xl text-yellow-500 mb-2" />
            <h3 className="font-bold mb-1">Địa chỉ</h3>
            <p>123 Đường Lego, Phường Vui Chơi, Quận Sáng Tạo, TP. Hà Nội</p>
          </div>
          <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md text-center">
            <FaPhoneAlt className="text-3xl text-red-500 mb-2" />
            <h3 className="font-bold mb-1">Số điện thoại</h3>
            <p>0909 123 456</p>
          </div>
          <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-md text-center">
            <FaEnvelope className="text-3xl text-blue-500 mb-2" />
            <h3 className="font-bold mb-1">Email</h3>
            <p>support@5broslego.com</p>
          </div>
        </div>

        {/* Form liên hệ */}
        <div className="bg-white p-8 rounded-2xl shadow-md max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Gửi tin nhắn cho chúng tôi</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              name="name"
              placeholder="Họ và tên"
              value={formData.name}
              onChange={handleChange}
              required
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <input
              type="text"
              name="subject"
              placeholder="Chủ đề"
              value={formData.subject}
              onChange={handleChange}
              required
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <textarea
              name="message"
              rows="5"
              placeholder="Nội dung liên hệ"
              value={formData.message}
              onChange={handleChange}
              required
              className="px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
            <button
              type="submit"
              className="w-full py-3 bg-red-500 text-white font-bold rounded-2xl hover:bg-red-600 transition-transform transform hover:scale-105"
            >
              Gửi liên hệ
            </button>
          </form>
        </div>

        {/* Bản đồ */}
        <div className="mb-12 max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">Bản đồ</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.621234567890!2d105.8160004154214!3d21.02851139355702!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab3f8e4a2a11%3A0xa8f2b48e4e7cd123!2s123%20Lego%20Street%2C%20Hanoi%2C%20Vietnam!5e0!3m2!1sen!2s!4v1699999999999!5m2!1sen!2s"
            className="w-full h-96 rounded-2xl shadow-md"
            allowFullScreen=""
            loading="lazy"
          />
        </div>

        {/* Mạng xã hội */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Kết nối với chúng tôi</h2>
          <div className="flex justify-center gap-6">
            <a href="https://www.facebook.com/5BROSLEGO" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-2xl text-blue-600 hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.instagram.com/5BROSLEGO" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-2xl text-pink-500 hover:scale-110 transition-transform" />
            </a>
            <a href="https://www.youtube.com/@5BROSLEGO" target="_blank" rel="noopener noreferrer">
              <FaYoutube className="text-2xl text-red-600 hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
