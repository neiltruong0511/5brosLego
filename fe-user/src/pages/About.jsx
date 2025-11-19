import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import lego1 from "../assets/quan1.jpg"; // dùng cho phần Sáng tạo
import lego2 from "../assets/quan2.jpg"; // dùng cho phần Quan tâm
import lego3 from "../assets/quan3.jpg"; // dùng cho phần Cảm hứng
import lego4 from "../assets/quan4.jpg"; // dùng cho phần Giới thiệu chung

const About = () => {
  // Hiệu ứng cuộn của trang giới thiệu
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 600, // Tăng nhẹ thời gian để mượt hơn
      easing: "ease-in-out",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <div className="px-6 py-16 font-sans bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
      <div className="max-w-6xl mx-auto">
        
        {/* --- PHẦN 1: GIỚI THIỆU CHUNG (Viết dài hơn để tăng điểm SEO) --- */}
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-yellow-600">
            "Ma Thuật Xây Dựng Cùng 5BROSLEGO"
          </h2>
          
          <div className="max-w-4xl mx-auto text-lg leading-relaxed space-y-4 text-gray-600 dark:text-gray-300">
            <p>
              Chào mừng bạn đến với <strong>5BROSLEGO</strong> – Thế giới đồ chơi lắp ráp chính hãng hàng đầu. 
              Tại đây, chúng tôi tin rằng LEGO không chỉ là những viên gạch nhựa vô tri, mà là công cụ tuyệt vời 
              để kích thích tư duy logic, rèn luyện tính kiên nhẫn và khơi dậy trí tưởng tượng bay bổng.
            </p>
            <p>
              Từ những bộ <em>LEGO Duplo</em> cho trẻ nhỏ đến những siêu phẩm <em>LEGO Technic</em> phức tạp 
              cho người lớn, mỗi sản phẩm tại 5BROSLEGO đều được tuyển chọn kỹ lưỡng, cam kết 100% chính hãng, 
              đảm bảo an toàn tuyệt đối theo tiêu chuẩn Châu Âu.
            </p>
          </div>

          <img
            src={lego4}
            alt="Bộ sưu tập LEGO chính hãng tại 5BROSLEGO" // [SEO] Alt chi tiết hơn
            className="mx-auto w-full max-w-[700px] my-10 rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
            data-aos="zoom-in"
          />

          {/* Tầm nhìn và Sứ mệnh */}
          <div className="flex flex-col md:flex-row justify-center gap-12 mt-10">
            <div className="text-center md:w-1/3" data-aos="fade-right">
              <div className="text-4xl mb-3">👁️</div>
              <h3 className="text-xl font-bold mb-2">Tầm nhìn</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Trở thành hệ thống phân phối LEGO uy tín nhất, mang niềm vui sáng tạo đến mọi gia đình Việt Nam.
              </p>
            </div>
            <div className="text-center md:w-1/3" data-aos="fade-left">
              <div className="text-4xl mb-3">💡</div>
              <h3 className="text-xl font-bold mb-2">Sứ mệnh</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Kiến tạo môi trường vui chơi lành mạnh, phát triển trí tuệ thông qua những bộ lắp ráp bền vững và an toàn.
              </p>
            </div>
          </div>
        </div>

        {/* --- PHẦN 2: GIÁ TRỊ CỐT LÕI (Viết chi tiết hơn) --- */}
        <h2 className="text-3xl font-bold text-center mb-12 text-yellow-600" data-aos="fade-up">
          Giá Trị Cốt Lõi
        </h2>
        
        <div className="space-y-16">
          
          {/* Sáng tạo */}
          <div className="flex flex-col md:flex-row items-center gap-8" data-aos="fade-right">
            <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-lg">
               <img src={lego3} alt="Sự sáng tạo với đồ chơi LEGO" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4 text-orange-600">1. Khơi Nguồn Sáng Tạo</h3>
              <p className="text-lg leading-7 text-gray-600 dark:text-gray-300 text-justify">
                Tại 5BROSLEGO, mỗi viên gạch là nền tảng cho sự sáng tạo vô hạn. Chúng tôi cung cấp đa dạng các dòng 
                chủ đề như <strong>LEGO City, Ninjago, Friends</strong> để trẻ em thỏa sức xây dựng thành phố ước mơ. 
                Việc lắp ráp giúp não bộ phát triển khả năng giải quyết vấn đề và tư duy không gian đa chiều.
              </p>
            </div>
          </div>

          {/* Quan tâm */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-8" data-aos="fade-left">
            <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-lg">
               <img src={lego2} alt="An toàn và chất lượng LEGO" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4 text-orange-600">2. An Toàn & Tận Tâm</h3>
              <p className="text-lg leading-7 text-gray-600 dark:text-gray-300 text-justify">
                Chúng tôi đặt sự an toàn của trẻ lên hàng đầu. Tất cả sản phẩm tại 5BROSLEGO đều làm từ nhựa ABS cao cấp, 
                không chứa chất độc hại. Bên cạnh đó, dịch vụ khách hàng của chúng tôi luôn sẵn sàng hỗ trợ đóng gói quà tặng, 
                bảo hành mảnh ghép thiếu và tư vấn nhiệt tình 24/7.
              </p>
            </div>
          </div>
          
          {/* Cảm hứng */}
          <div className="flex flex-col md:flex-row items-center gap-8" data-aos="fade-right">
            <div className="w-full md:w-1/2 overflow-hidden rounded-2xl shadow-lg">
               <img src={lego1} alt="Cộng đồng đam mê LEGO" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-bold mb-4 text-orange-600">3. Kết Nối Đam Mê</h3>
              <p className="text-lg leading-7 text-gray-600 dark:text-gray-300 text-justify">
                5BROSLEGO không chỉ bán hàng, chúng tôi xây dựng một cộng đồng những người yêu thích LEGO. 
                Đây là nơi chia sẻ những tác phẩm MOC (My Own Creation) độc đáo, là nguồn cảm hứng bất tận cho 
                những ai đam mê lắp ráp, từ những người mới bắt đầu cho đến những nhà sưu tập lão luyện.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;