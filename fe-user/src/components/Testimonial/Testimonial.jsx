import React from "react";
import Slider from "react-slick";
import BgPattern from "../../assets/vector3.png"; 

// Dữ liệu giả định về các nhận xét của khách hàng
const testimonialData = [
  {
    id: 1,
    name: "Hữu Linh",
    text: "Bộ LEGO đúng như mong đợi, chi tiết sắc nét, màu sắc tươi sáng. Đóng gói kỹ, không bị móp hộp. Giao hàng nhanh, sản phẩm nguyên vẹn. Rất hài lòng!",
    img: "https://picsum.photos/101/101",
  },
  {
    id: 2,
    name: "Phi Hùng",
    text: "Bộ LEGO giao đúng mẫu, chất lượng tốt. Tuy nhiên một vài mảnh hơi lỏng, lắp chưa thật khít. Lần sau mình sẽ chọn dòng cao cấp hơn.",
    img: "https://picsum.photos/102/102",
  },
  {
    id: 3,
    name: "Duy Kiệt",
    text: "Shop đóng gói cẩn thận, hộp LEGO sạch đẹp. Mảnh ghép đầy đủ, màu sắc chuẩn. Mình mua nhiều lần rồi, lần nào cũng rất ổn!",
    img: "https://picsum.photos/103/103",
  },
  {
    id: 4,
    name: "Ngọc Quý",
    text: "Bộ LEGO đúng mô tả nhưng giao hơi chậm, chắc do dịp sale đông khách. Hy vọng shop cải thiện tốc độ xử lý đơn hàng.",
    img: "https://picsum.photos/104/104",
  },
  {
    id: 5,
    name: "Tuấn Tú",
    text: "Bộ LEGO chất lượng ổn định nhưng giao hơi chậm, có lẽ do đơn nhiều. Mong lần tới nhận hàng nhanh hơn.",
    img: "https://picsum.photos/105/105",
  },
];

const Testimonial = () => {
  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    cssEase: "linear",
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  return (
    <>
      <div
        className="py-16 relative bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${BgPattern})`, 
        }}
        data-aos="fade-up"
        data-aos-duration="400"
      >
        {/* Overlay mờ nhẹ để chữ dễ đọc */}
        <div className="absolute inset-0 bg-white/70 dark:bg-black/40 backdrop-blur-sm"></div>

        <div className="relative container mx-auto z-10">
          {/* Tiêu đề */}
          <div className="text-center mb-10 max-w-[600px] mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-[#6b3f24] mb-4">
              Phản Hồi Khách Hàng
            </h2>
            <p className="text-gray-600 text-sm md:text-base italic">
              “Tôi thực sự ấn tượng với chất lượng sản phẩm và dịch vụ. Bộ Lego
              rất đẹp, các mảnh ghép tinh xảo, đóng gói cẩn thận, giao hàng
              nhanh chóng. Tôi chắc chắn sẽ mua thêm nhiều lần nữa!”
            </p>
          </div>

          {/* Slider */}
          <div
            data-aos="zoom-in"
            data-aos-duration="400"
            className="max-w-[600px] mx-auto"
          >
            <Slider {...settings}>
              {testimonialData.map((data) => (
                <div key={data.id} className="my-6">
                  <div className="flex flex-col justify-center items-center gap-4 text-center bg-white/80 dark:bg-gray-800/80 shadow-xl p-6 rounded-2xl relative border border-yellow-200">
                    <img
                      className="rounded-full block mx-auto w-20 h-20 object-cover shadow-md border-2 border-[#e11d48]"
                      src={data.img}
                      alt={data.name}
                    />
                    <p className="text-gray-600 text-sm italic">{data.text}</p>
                    
                    <h3 className="text-lg font-bold text-[#6b3f24]">
                      {data.name}
                    </h3>
                    
                    <p className="text-[#e11d48]/20 text-8xl font-serif absolute top-0 right-4">
                      “”
                    </p>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </>
  );
};

export default Testimonial;