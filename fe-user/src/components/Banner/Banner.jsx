// ===== LEGO STORE BANNER =====
import React from "react";
import LegoImg from "../../assets/bannerlego.png";
import BgPattern from "../../assets/vector3.png";
import { FaCubes, FaChild, FaPuzzlePiece, FaCartShopping } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Banner = () => {
  const bgImage = {
    backgroundImage: `url(${BgPattern})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    height: "100%",
    width: "100%",
  };

  return (
    <div className="min-h-[600px]" style={bgImage}>
      <div className="min-h-[600px] flex justify-center items-center backdrop-blur-sm py-12 sm:py-0">
        <div data-aos="slide-up" data-aos-duration="400" className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-center">
            {/* Hình ảnh LEGO */}
            <div className="flex justify-center items-center">
              <img
                src={LegoImg}
                alt="Bộ lắp ráp LEGO tại 5BrosLego" 
                className="max-w-[550px] sm:max-w-[650px] lg:max-w-[750px] w-full mx-auto 
                drop-shadow-[-5px_5px_25px_rgba(0,0,0,0.3)] rounded-3xl 
                hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Nội dung giới thiệu */}
            <div className="flex flex-col justify-center gap-6 sm:pt-0">
              <h2 className="text-4xl sm:text-5xl font-extrabold text-yellow-500 drop-shadow-md">
                5BROSLEGO
              </h2>
              <p className="text-base text-gray-700 leading-6 tracking-wide dark:text-gray-300">
                Khám phá thế giới LEGO đầy màu sắc – nơi bạn có thể tự tay xây dựng
                thành phố, nhân vật và những cuộc phiêu lưu của riêng mình.
                <br />
                <br />
                Từ bộ sưu tập <b>Star Wars</b> đến <b>LEGO City</b>, mỗi mảnh ghép
                đều mở ra một thế giới sáng tạo không giới hạn!
              </p>

              {/* Icon LEGO */}
              <div className="flex gap-6">
                <div aria-hidden="true" className="flex gap-6">
                    <FaCubes className="text-4xl h-16 w-16 shadow-md p-4 rounded-full bg-yellow-100 text-yellow-600" />
                    <FaChild className="text-4xl h-16 w-16 shadow-md p-4 rounded-full bg-red-100 text-red-500" />
                    <FaPuzzlePiece className="text-4xl h-16 w-16 shadow-md p-4 rounded-full bg-blue-100 text-blue-600" />
                </div>
              </div>

              {/* Nút hành động */}
              <div>
                <Link
                  to="/product"
                  className="w-[160px] flex items-center justify-center text-center px-4 py-2 rounded-3xl 
                  border border-red-500 bg-red-500 hover:bg-red-600 text-white font-semibold 
                  transition-transform transform hover:scale-105 duration-200 shadow-md text-sm"
                >
                  <span className="font-bold mr-1">Xem sản phẩm</span>
                  <FaCartShopping className="text-sm ml-1 drop-shadow-sm" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;