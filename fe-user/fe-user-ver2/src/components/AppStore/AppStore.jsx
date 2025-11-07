import React from "react";
import AppStoreImg from "../../assets/app_store.png"; // Hình ảnh App Store
import PlayStoreImg from "../../assets/play_store.png"; // Hình ảnh Play Store
import Gif from "../../assets/mobile_bike.gif"; // Hình ảnh GIF của chiếc xe đạp

const AppStore = () => {
  return (
    <>
      <div className="bg-gray-100 dark:bg-gray-800 py-14">
        {/* Phần bao bọc phần tử App Store với nền xám nhạt và đệm trên dưới */}
        <div className="container">
          {/* Grid chia thành 2 cột: 1 cho nội dung và 1 cho GIF */}
          <div className="grid sm:grid-cols-2 grid-cols-1 items-center gap-4">
            {/* Phần nội dung */}
            <div
              data-aos="fade-up" // Hiệu ứng khi cuộn trang
              data-aos-duration="300" // Thời gian hiệu ứng kéo dài 300ms
              className="space-y-6 max-w-xl mx-auto"
            >
              {/* Tiêu đề với kiểu chữ lớn */}
              <h1 className="text-2xl text-center sm:text-left sm:text-4xl font-semibold text-gray-700 dark:text-gray-400">
                Wolsom có sẵn trên Android và IOS
              </h1>
              {/* Các nút tải ứng dụng từ Play Store và App Store */}
              <div className="flex flex-wrap justify-center sm:justify-start items-center">
                <a href="#">
                  <img
                    src={PlayStoreImg} // Hình ảnh Play Store
                    alt="Play store"
                    className="max-w-[150px] sm:max-w-[120px] md:max-w-[200px]"
                    // Đặt chiều rộng tối đa cho hình ảnh tùy theo màn hình
                  />
                </a>
                <a href="#">
                  <img
                    src={AppStoreImg} // Hình ảnh App Store
                    alt="App store"
                    className="max-w-[150px] sm:max-w-[120px] md:max-w-[200px]"
                    // Đặt chiều rộng tối đa cho hình ảnh tùy theo màn hình
                  />
                </a>
              </div>
            </div>
            {/* Phần GIF với hiệu ứng zoom-in khi cuộn trang */}
            <div data-aos="zoom-in" data-aos-duration="300">
              <img
                src={Gif} // Hình ảnh GIF
                alt="mobile bike"
                className="w-full sm:max-w-[60%] block rounded-md mx-auto mix-blend-multiply dark:mix-blend-difference"
                // Chiều rộng hình ảnh là 100%, tối đa 60% ở màn hình lớn
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AppStore;
