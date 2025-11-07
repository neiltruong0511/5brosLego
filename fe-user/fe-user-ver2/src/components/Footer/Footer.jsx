// Importing React và hook useState từ thư viện 'react'.
import React, { useState } from "react";
// Importing các biểu tượng từ thư viện react-icons để sử dụng trong giao diện người dùng.
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";
// Importing logo của quán cà phê để hiển thị trong footer.
import footerLogo from "../../assets/food-logo.png";

// Component Footer hiển thị phần chân trang của website.
const Footer = () => {
  return (
    // Phần footer được bao quanh bởi một div với màu nền xám.
    <div className="bg-gray-100 dark:bg-gray-950">
      {/* Container chính với chiều rộng tối đa 1200px và căn giữa */}
      <section className="max-w-[1200px] mx-auto">
        <div className=" grid md:grid-cols-3 py-5">
          {/* Cột đầu tiên chứa logo, mô tả quán cà phê, thông tin liên hệ và các biểu tượng mạng xã hội */}
          <div className=" py-8 px-4 ">
            {/* Tiêu đề với logo và tên quán */}
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
              {/* Ảnh logo của quán */}
              <img src={footerLogo} alt="Logo" className="max-w-[50px]" />
              WOLSOM
            </h1>
            {/* Mô tả ngắn về quán cà phê */}
            <p className="">
              Wolsom là quán cà phê mang đến không gian thư giãn và lý tưởng, kết hợp với những tách cà phê đậm đà. Chúng tôi cam kết
              mang lại trải nghiệm tuyệt vời, nơi bạn có thể tận hưởng những phút giây thư thái cùng bạn bè và người thân.
            </p>
            <br />
            {/* Địa chỉ quán cà phê */}
            <div className="flex items-center gap-3">
              {/* Biểu tượng địa chỉ */}
              <FaLocationArrow />
              {/* Địa chỉ */}
              <p>78 Xô Viết Nghệ Tĩnh, Phường 25, Bình Thạnh, TP.Hồ Chí Minh</p>
            </div>
            {/* Số điện thoại quán cà phê */}
            <div className="flex items-center gap-3 mt-3">
              {/* Biểu tượng điện thoại */}
              <FaMobileAlt />
              {/* Số điện thoại */}
              <p>+98 3247561</p>
            </div>
            {/* Các biểu tượng mạng xã hội (Instagram, Facebook, LinkedIn) */}
            <div className="flex items-center gap-3 mt-6">
              <a href="#">
                <FaInstagram className="text-3xl" />
              </a>
              <a href="#">
                <FaFacebook className="text-3xl" />
              </a>
              <a href="#">
                <FaLinkedin className="text-3xl" />
              </a>
            </div>
          </div>

          {/* Cột thứ hai chứa các liên kết quan trọng, mạng xã hội và email hỗ trợ */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10 ">
            <div className="">
              <div className="py-8 px-4 ">
                {/* Tiêu đề cho phần liên kết quan trọng */}
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Important Links
                </h1>
                {/* Danh sách các liên kết quan trọng */}
                <ul className={`flex flex-col gap-3`}>
                  <li className="cursor-pointer">Home</li>
                  <li className="cursor-pointer">About</li>
                  <li className="cursor-pointer">Services</li>
                  <li className="cursor-pointer">Login</li>
                </ul>
              </div>
            </div>
            {/* Cột thứ ba chứa thông tin về mạng xã hội và Instagram */}
            <div className="">
              <div className="py-8 px-4 ">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  SOCIAL MEDIA
                </h1>
                <ul className="flex flex-col gap-3">
                  <li className="cursor-pointer">Our Social Instagram</li>
                  <li className="cursor-pointer">wolsom</li>
                </ul>
              </div>
            </div>
            {/* Cột thứ tư chứa email hỗ trợ */}
            <div className="">
              <div className="py-8 px-4 ">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  SUPPORT EMAIL
                </h1>
                {/* Danh sách email hỗ trợ */}
                <ul className="flex flex-col gap-3">
                  <li className="cursor-pointer">wolsom@gmail.com</li>
                  <li className="cursor-pointer">wolsom@gmail.com</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Phần cuối footer với thông tin bản quyền */}
        <div>
          <div className="text-center py-10 border-t-2 border-gray-300/50">
            {/* Văn bản bản quyền */}
            @copyright 2025 All rights reserved || Made with ❤️ by Wolsom Coffee
          </div>
        </div>
      </section>
    </div>
  );
};

// Xuất component Footer để có thể sử dụng ở các phần khác của ứng dụng.
export default Footer;
