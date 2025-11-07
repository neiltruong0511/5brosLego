import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import lego1 from "../assets/quan1.jpg"; // dùng cho phần Sáng tạo
import lego2 from "../assets/quan2.jpg"; // dùng cho phần Quan tâm
import lego3 from "../assets/quan3.jpg"; // dùng cho phần Cảm hứng
import lego4 from "../assets/quan4.jpg"; // dùng cho phần Giới thiệu chung

const About = () => {      //Hiệu ứng cuộn của trang giới thiệu
  useEffect(() => {
    AOS.init({
      offset: 100,         
      duration: 500,      
      easing: "ease-in-sine", // Kiểu chuyển động
      delay: 100,         
    });
    AOS.refresh(); // Cập nhật lại AOS để đảm bảo mọi thành phần được áp dụng đúng hiệu ứng
  }, []);

  return (
    <div className="px-6 py-12 font-sans"> 
      <div className="max-w-5xl mx-auto"> 
        {/* Giới thiệu chung */}
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-2xl font-bold mb-4">"Ma Thuật Xây Dựng Lego"</h2>
          <p className="mb-4 max-w-3xl mx-auto">
            Lego luôn khuyến khích sự sáng tạo vô tận, từ những viên gạch nhỏ bé đến những tác phẩm vĩ đại. 
            Mỗi bộ Lego đều được thiết kế tỉ mỉ, mang đến niềm vui xây dựng và khám phá cho mọi lứa tuổi.
          </p>
          <img
          src={lego4} // Hình ảnh đại diện cho sản phẩm Lego
          alt="Sản phẩm Lego" // Mô tả hình ảnh
          className="mx-auto w-full max-w-[600px] my-10 rounded-3xl shadow-2xl transform scale-95 transition-transform duration-700 ease-in-out hover:scale-105" 
          data-aos="zoom-in" // Hiệu ứng phóng to khi cuộn đến 
          />
          {/* thẻ div của tầm nhìn và sử mệnh  */}
          <div className="flex flex-col sm:flex-row justify-center gap-12 mt-6">
            <div className="text-center" data-aos="fade-right">
              <div className="text-3xl mb-2">👁️</div>
              <h4 className="font-semibold">Tầm nhìn</h4>
              <p className="max-w-xs mx-auto">
                Mang niềm vui xây dựng và sáng tạo đến mọi trẻ em và người lớn trên toàn thế giới.
              </p>
            </div>
            <div className="text-center" data-aos="fade-left">
              <div className="text-3xl mb-2">💡</div>
              <h4 className="font-semibold">Sứ mệnh</h4>
              <p className="max-w-xs mx-auto">
                Khuyến khích học tập, sáng tạo và phát triển kỹ năng thông qua trò chơi xây dựng bền vững.
              </p>
            </div>
          </div>
        </div>

        {/* Giá trị cốt lỗi */}
        <h2 className="text-2xl font-bold text-center mb-10" data-aos="fade-up">
          Giá trị cốt lõi
        </h2>
        <div className="space-y-12">
          {/* Sáng tạo */}
          <div className="flex flex-col md:flex-row items-center gap-6" data-aos="fade-right">
            <img src={lego3} alt="Sáng tạo" className="w-full md:w-1/2 rounded-lg shadow-md" />
            <div className="md:w-1/2">
              <h3 className="text-xl font-semibold mb-2">Sáng tạo</h3>
              <p>
                Tại Lego, mỗi viên gạch là nền tảng cho sự sáng tạo vô hạn. 
                Chúng tôi thiết kế các bộ Lego để khơi dậy trí tưởng tượng và khả năng xây dựng của mọi người.
              </p>
            </div>
          </div>

          {/* Quan tâm */}
          <div className="flex flex-col md:flex-row-reverse items-center gap-6" data-aos="fade-left">
            <img src={lego2} alt="Quan tâm" className="w-full md:w-1/2 rounded-lg shadow-md" />
            <div className="md:w-1/2">
              <h3 className="text-xl font-semibold mb-2">Quan tâm</h3>
              <p>
                Lego đề cao giá trị cộng đồng và sự quan tâm đến trẻ em. 
                Chúng tôi cam kết tạo ra môi trường an toàn, vui vẻ và hỗ trợ phát triển toàn diện cho mọi thế hệ.
              </p>
            </div>
          </div>
          
          {/* Cảm hứng */}
          <div className="flex flex-col md:flex-row items-center gap-6" data-aos="fade-right">
            <img src={lego1} alt="Cảm hứng" className="w-full md:w-1/2 rounded-lg shadow-md" />
            <div className="md:w-1/2">
              <h3 className="text-xl font-semibold mb-2">Cảm hứng</h3>
              <p>
                Chúng tôi mong muốn Lego sẽ là nguồn cảm hứng cho những ai đam mê sáng tạo, học hỏi,
                hay đơn giản là tìm kiếm niềm vui trong việc xây dựng và khám phá thế giới xung quanh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
