import React from "react";
// Import các hình ảnh liên quan đến món biryani
import BiryaniImg1 from "../../assets/biryani3.png";
import BiryaniImg2 from "../../assets/biryani5.png";
import BiryaniImg3 from "../../assets/biryani2.png";
// Import ảnh nền vector
import Vector from "../../assets/vector3.png";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
// Định nghĩa danh sách các ảnh biryani để người dùng có thể lựa chọn
const ImageList = [
  {
    id: 1,
    img: BiryaniImg1,
  },
  {
    id: 2,
    img: BiryaniImg2,
  },
  {
    id: 3,
    img: BiryaniImg3,
  },
];

// Component Hero
const Hero = () => {
  // State để lưu trữ hình ảnh hiện tại đang hiển thị
  const [imageId, setImageId] = React.useState(BiryaniImg1);

  // Định nghĩa các thuộc tính cho background, sử dụng hình ảnh vector
  const bgImage = {
    backgroundImage: `url(${Vector})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
  };

  return (
    <>
      {/* Phần Hero với chiều cao tối thiểu và background với hình ảnh vector */}
      <div
        className="min-h-[550px] sm:min-h-[600px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-black duration-200"
        style={bgImage}
      >
        <div className="container pb-8 sm:pb-0">
          <div className="grid grid-cols-1 sm:grid-cols-2">
            {/* Phần nội dung văn bản */}
            <div
              data-aos="zoom-out"
              data-aos-duration="400"
              data-aos-once="true"
              className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1"
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold">
                Welcome{" "}
                <span class="bg-clip-text text-transparent bg-gradient-to-b from-primary to-secondary">
                  Wolsom
                </span>{" "}
                Coffee
              </h1>
              <p className="text-sm ">
                Thứ hai đến Thứ 7 8:30am - 11:00pm | Hotline:19001879
                <br />
                ----------------------------------------------------------------------------
                <br />
                Tiệm chúng tôi mang đến những tách cà phê,trà và nước
                ép tuyệt hảo,được chọn lọc từ những nguyên liệu đặc biệt và
                tinh túy nhất.
              </p>
              {/* Nút đặt hàng với kiểu gradient */}
              <div>
                  <Link
                    to="/product"
                    className="w-[180px] flex items-center justify-center text-center px-4 py-2 rounded-3xl border transition-all transform bg-gradient-to-r from-primary to-secondary text-white hover:border-white hover:bg-white hover:text-white hover:scale-105 duration-200">
                    <span className="text-md font-bold mr-1">Xem sản phẩm</span>
                    {/* Biểu tượng giỏ hàng */}
                    <FaCartShopping className="text-md ml-1 drop-shadow-sm cursor-pointer" />
                  </Link>
                </div>
            </div>

            {/* Phần hiển thị hình ảnh */}
            <div className="min-h-[450px] sm:min-h-[450px] flex justify-center items-center relative order-1 sm:order-2 ">
              <div className="h-[300px] sm:h-[450px] overflow-hidden flex justify-center items-center">
                {/* Hình ảnh hiện tại được chọn */}
                <img
                  data-aos="zoom-in"
                  data-aos-duration="300"
                  data-aos-once="true"
                  src={imageId}
                  alt="biryani img"
                  className="w-[300px] sm:w-[450px] sm:scale-125 mx-auto spin "
                />
              </div>

              {/* Phần hiển thị các ảnh nhỏ để người dùng có thể chọn */}
              <div className="flex lg:flex-col lg:top-1/2 lg:-translate-y-1/2 lg:py-2 justify-center gap-4 absolute bottom-[0px] lg:-right-10 bg-white/30 rounded-full">
                {ImageList.map((item) => (
                  <img
                    data-aos="zoom-in"
                    data-aos-duration="400"
                    data-aos-once="true"
                    src={item.img}
                    onClick={() => {
                      // Chuyển đổi hình ảnh hiển thị khi người dùng chọn ảnh nhỏ
                      setImageId(
                        item.id === 1
                          ? BiryaniImg1
                          : item.id === 2
                          ? BiryaniImg2
                          : BiryaniImg3
                      );
                    }}
                    alt="biryani img"
                    className="max-w-[80px] h-[80px] object-contain inline-block hover:scale-105 duration-200"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
