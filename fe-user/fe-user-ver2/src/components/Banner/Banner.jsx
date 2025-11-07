// Import các thư viện và tài nguyên cần thiết.
import React from "react";
// Import hình ảnh từ thư mục assets.
import BiryaniImg from "../../assets/biryani5.png";
import Vector from "../../assets/vector3.png";
// Import các biểu tượng từ thư viện react-icons.
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";
import { Link } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
// Component Banner hiển thị banner với hình ảnh, thông tin giờ mở cửa và các biểu tượng.
const Banner = () => {
  // Định nghĩa đối tượng style cho hình nền của banner.
  const bgImage = {
    backgroundImage: `url(${Vector})`, // Cung cấp đường dẫn hình nền.
    backgroundPosition: "center", // Đặt vị trí hình nền ở trung tâm.
    backgroundRepeat: "no-repeat", // Hình nền không lặp lại.
    backgroundSize: "cover", // Hình nền sẽ tự động phủ hết không gian của phần tử.
    height: "100%", // Chiều cao chiếm toàn bộ chiều cao của phần tử cha.
    width: "100%", // Chiều rộng chiếm toàn bộ chiều rộng của phần tử cha.
  };

  return (
    <>
      <div className="min-h-[550px]">
        {/* Phần tử div này là khu vực banner chính, với chiều cao tối thiểu là 550px */}
        <div className="min-h-[550px] flex justify-center items-center backdrop-blur-xl py-12 sm:py-0 ">
          {/* Container chứa các nội dung của banner */}
          <div
            data-aos="slide-up" // Hiệu ứng cuộn khi hiển thị (slide-up).
            data-aos-duration="300" // Thời gian hiệu ứng kéo dài 300ms.
            className="container"
          >
            {/* Grid chia thành 2 cột: 1 cho hình ảnh, 1 cho nội dung văn bản */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Phần hình ảnh của banner */}
              <div>
                <img
                  src={BiryaniImg} // Đường dẫn hình ảnh biryani.
                  alt="biryani img" // Thuộc tính alt cho hình ảnh.
                  className="max-w-[430px] w-full mx-auto drop-shadow-[-5px_5px_25px_rgba(0,0,0,0.4)] rounded-3xl" // Class này làm hình ảnh có độ rộng tối đa là 430px, căn giữa và có hiệu ứng bóng mờ.
                  // Class này làm hình ảnh có độ rộng tối đa là 430px, căn giữa và có hiệu ứng bóng mờ.
                />
              </div>
              {/* Phần nội dung văn bản */}
              <div className="flex flex-col justify-center gap-6 sm:pt-0">
                <h1 className="text-3xl sm:text-4xl font-bold">Giờ Mở Cửa</h1>
                <p className="text-sm text-gray-500 tracking-wide leading-5">
                  {/* Thông tin giờ mở cửa */}
                  <b>Thứ 2 đến thứ 6 hàng tuần</b>
                  <br />
                  <br />
                  7:00am-11:00am
                  <br />
                  11:00am-11:00pm
                  <br />
                  <br />
                  <b>Thứ 7 đến Chủ nhật hàng tuần</b>
                  <br />
                  <br />
                  7:00am-11:00am
                  <br />
                  11:00am-11:00pm
                </p>
                {/* Các biểu tượng được hiển thị theo dạng flex */}
                <div className="flex gap-6">
                  <div>
                    <GrSecure className="text-4xl h-20 w-20 shadow-sm p-5 rounded-full bg-violet-100 dark:bg-violet-400" />
                  </div>
                  <div>
                    <IoFastFood className="text-4xl h-20 w-20 shadow-sm p-5 rounded-full bg-orange-100 dark:bg-orange-400" />
                  </div>
                  <div>
                    <GiFoodTruck className="text-4xl h-20 w-20 shadow-sm p-5 rounded-full bg-green-100 dark:bg-green-400" />
                  </div>
                </div>
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// Xuất component Banner để có thể sử dụng ở các phần khác của ứng dụng.
export default Banner;
