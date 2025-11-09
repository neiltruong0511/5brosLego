import React from "react";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";
import footerLogo from "../../assets/lego.png";

const Footer = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-950 text-gray-800 dark:text-gray-200">
      <section className="max-w-[1200px] mx-auto px-4">
        <div className="grid md:grid-cols-4 py-5">
          {/* Cột 1 (chiếm 2 cột) */}
          <div className="md:col-span-2 py-8">
            <h1 className="text-2xl font-bold flex items-center gap-3 mb-3">
              <img src={footerLogo} alt="Logo" className="max-w-[50px]" />
              <span className="text-500">5BROSLEGO</span>
            </h1>
            <p>
              5BROSLEGO là cửa hàng mang đến không gian sáng tạo và giải trí tuyệt vời,
              nơi bạn có thể thỏa sức khám phá những bộ LEGO độc đáo và tinh xảo.
              Chúng tôi cam kết mang lại trải nghiệm tuyệt vời, giúp bạn tận hưởng
              những phút giây thư giãn và sáng tạo cùng bạn bè và người thân.
            </p>
            <div className="flex items-start gap-3 mt-5">
              <FaLocationArrow className="text-orange-500 mt-1" />
              <p>5 Đặng Thùy Trâm, Phường 25, Bình Thạnh, TP.Hồ Chí Minh</p>
            </div>
            <div className="flex items-center gap-3 mt-3">
              <FaMobileAlt className="text-orange-500" />
              <p>+98 7463921</p>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <a href="https://www.instagram.com/wolsom/" className="hover:text-[#E1306C] transition-all duration-200">
                <FaInstagram className="text-3xl" />
              </a>
              <a href="https://www.instagram.com/wolsom/" className="hover:text-[#1877F2] transition-all duration-200">
                <FaFacebook className="text-3xl" />
              </a>
              <a href="https://www.instagram.com/wolsom/" className="hover:text-[#0A66C2]  transition-all duration-200">
                <FaLinkedin className="text-3xl" />
              </a>
            </div>
          </div>

          {/* Cột 2, 3, 4 */}
          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 md:pl-10">
            {/* Cột Important Links */}
            <div className="py-8">
              <h1 className="text-xl font-bold mb-3 hover:underline underline-offset-4 decoration-orange-400 transition-all duration-200">
                Important Links
              </h1>
              <ul className="flex flex-col gap-3 text-gray-700 dark:text-gray-300">
                <li className="cursor-pointer hover:text-orange-500 transition-all duration-200">
                  <a href = "http://localhost:5173/">Home</a>
                  </li>
                <li className="cursor-pointer hover:text-orange-500 transition-all duration-200">
                  <a href= "http://localhost:5173/about">About</a>
                  </li>
                <li className="cursor-pointer hover:text-orange-500 transition-all duration-200">
                  <a href= "http://localhost:5173/#services">Service</a>
                  </li>
                <li className="cursor-pointer hover:text-orange-500 transition-all duration-200">
                  <a href= "http://localhost:5173/login">Login</a>
                  </li>
              </ul>
            </div>

            {/* Cột Social Media */}
            <div className="py-8">
              <h1 className="text-xl font-bold mb-3 hover:underline underline-offset-4 decoration-orange-400 transition-all duration-200">
                Social Media
              </h1>
              <ul className="flex flex-col gap-3 text-gray-700 dark:text-gray-300">
                <li className="cursor-pointer hover:text-orange-500 transition-all duration-200">Our Social Instagram</li>
                <li className="cursor-pointer hover:text-orange-500 transition-all duration-200">5BROSLEGO</li>
              </ul>
            </div>

            {/* Cột Support Email */}
            <div className="py-8">
              <h1 className="text-xl font-bold mb-3 hover:underline underline-offset-4 decoration-orange-400 transition-all duration-200">
                Support Email
              </h1>
              <ul className="flex flex-col gap-3 text-gray-700 dark:text-gray-300">
                <li className="cursor-pointer hover:text-orange-500 transition-all duration-200">5BROSLEGO@gmail.com</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="text-center py-10 border-t border-gray-300/50 text-sm text-gray-500">
          © 2025 All rights reserved || Made with ❤️ by{" "}
          <span className="text-orange-500 font-semibold">5BROSLEGO</span>
        </div>
      </section>
    </div>
  );
};

export default Footer;
