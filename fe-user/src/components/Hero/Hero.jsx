import React, { useEffect } from "react";
import BannerLego from "../../assets/bannerlego1.png";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import AOS from "aos";
import "aos/dist/aos.css";

const Hero = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: false,
    });
  }, []);

  return (
    <>
      {/* Hero banner toàn trang */}
      <div
        className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden"
        data-aos="fade-in"
      >
        {/* Ảnh nền banner Lego */}
        <img
          src={BannerLego}
          alt="Lego Banner"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-700"
        />

        {/* Lớp phủ mờ để làm nổi nội dung */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Nội dung hiển thị trên banner */}
        <div
          className="relative z-10 text-center text-white px-6 sm:px-12"
          data-aos="zoom-out"
        >
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4">
            Chào mừng đến với{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              5BROSLEGO
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
            Cửa hàng chúng tôi mang đến những bộ Lego tuyệt vời, được chọn lọc
            từ những dòng sản phẩm độc đáo và chất lượng nhất, giúp bạn thỏa sức
            sáng tạo và khám phá thế giới mô hình đầy sắc màu.
          </p>

          {/* Nút chuyển sang màu đỏ */}
          <Link
            to="/product"
            className="inline-flex items-center justify-center px-6 py-3 rounded-3xl 
                       bg-[#e60000] hover:bg-[#b30000] text-white font-bold 
                       shadow-lg hover:scale-105 transition-transform duration-300"
          >
            <span>Xem sản phẩm</span>
            <FaCartShopping className="ml-2" />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Hero;
