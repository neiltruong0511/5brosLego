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
      {/* --- PHẦN 1: HERO BANNER (Giữ nguyên như cũ) --- */}
      <div
        className="relative w-full h-[90vh] flex items-center justify-center overflow-hidden"
        data-aos="fade-in"
      >
        {/* Ảnh nền banner Lego */}
        <img
          src={BannerLego}
          alt="Banner 5BROSLEGO Cửa hàng đồ chơi lắp ráp"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105 transition-transform duration-700"
        />

        {/* Lớp phủ mờ */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Nội dung hiển thị trên banner */}
        <div
          className="relative z-10 text-center text-white px-6 sm:px-12"
          data-aos="zoom-out"
        >
          {/* THẺ H1 DUY NHẤT CỦA TRANG WEB */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4">
            Chào mừng đến với{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500">
              5BROSLEGO
            </span>
          </h1>

          <p className="text-base sm:text-lg lg:text-xl mb-8 max-w-3xl mx-auto leading-relaxed text-gray-100">
            Cửa hàng chúng tôi mang đến những bộ Lego tuyệt vời, được chọn lọc
            từ những dòng sản phẩm độc đáo và chất lượng nhất.
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

      {/* --- PHẦN 2: [MỚI THÊM] NỘI DUNG SEO ĐỂ TĂNG TEXT RATIO --- */}
      <section className="bg-white dark:bg-gray-900 py-12 px-6">
        <div className="container mx-auto max-w-5xl text-center sm:text-justify">
          <h2 className="text-3xl font-bold text-yellow-600 mb-6 text-center" data-aos="fade-up">
            Tại sao nên chọn mua đồ chơi tại 5BROSLEGO?
          </h2>
          
          <div className="space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed" data-aos="fade-up" data-aos-delay="100">
            <p>
              Chào mừng bạn đến với <strong>5BROSLEGO</strong> – địa chỉ uy tín hàng đầu chuyên cung cấp các dòng sản phẩm 
              đồ chơi lắp ráp LEGO chính hãng tại Việt Nam. Tại đây, chúng tôi không chỉ bán đồ chơi, mà còn mang đến 
              niềm vui, sự sáng tạo bất tận cho trẻ em cũng như những người đam mê sưu tầm mô hình.
            </p>
            
            <p>
              Chúng tôi tự hào sở hữu kho hàng đa dạng với hàng trăm mẫu mã từ các chủ đề hot nhất như 
              <em> LEGO City, LEGO Ninjago, LEGO Technic, LEGO Star Wars, LEGO Harry Potter</em> cho đến các bộ lắp ráp 
              dành cho người lớn (LEGO Icons). Tất cả sản phẩm tại 5BROSLEGO đều được cam kết 100% chính hãng, nguyên seal, 
              đảm bảo an toàn tuyệt đối cho sức khỏe của người chơi.
            </p>
            
            <p>
              Bên cạnh chất lượng sản phẩm, <strong>5BROSLEGO</strong> luôn nỗ lực tối ưu trải nghiệm mua sắm của khách hàng 
              với dịch vụ giao hàng siêu tốc tại TP.HCM, đóng gói cẩn thận chống móp méo (Double box) và chính sách đổi trả minh bạch. 
              Đội ngũ tư vấn viên am hiểu về LEGO luôn sẵn sàng hỗ trợ bạn chọn được bộ lắp ráp ưng ý nhất làm quà tặng sinh nhật 
              hay bổ sung vào bộ sưu tập cá nhân. Hãy để 5BROSLEGO đồng hành cùng đam mê sáng tạo của bạn ngay hôm nay!
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;