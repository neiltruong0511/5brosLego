import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Img1 from "../../assets/discover1.png"; // LEGO tặng quà
import Img2 from "../../assets/discover2.png"; // LEGO phóng viên
import Img3 from "../../assets/discover3.jpg"; // LEGO Black Friday
import Banner from "../../assets/vector3.png"; // hình nền banner LEGO

const DiscoverMore = () => {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 500,
      easing: "ease-in-sine",
      delay: 100,
    });
    AOS.refresh();
  }, []);

  return (
    <section
      className="relative bg-white dark:bg-gray-900 py-16 bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: `url(${Banner})` }}
    >
      {/* Lớp phủ mờ */}
      <div className="absolute inset-0 bg-white/80 dark:bg-black/60"></div>

      <div className="relative container mx-auto px-4">
        {/* Tiêu đề */}
        <h2
          className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-10 text-center"
          data-aos="fade-up"
        >
          Khám phá thêm
        </h2>

        {/* Grid 3 cột */}
        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-10">
          {/* Thẻ 1 */}
          <div
            className="text-center bg-white/90 dark:bg-gray-800/80 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-transform duration-700 ease-in-out"
            data-aos="fade-up"
          >
            <img
              src={Img1}
              alt="Tặng quà"
              className="mx-auto w-full max-w-[350px] rounded-2xl shadow-md transform scale-95 transition-transform duration-700 ease-in-out hover:scale-105"
              data-aos="zoom-in"
            />
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Trao gửi yêu thương
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 mb-5">
                Gợi ý quà tặng phù hợp cho mọi dịp, mọi lứa tuổi và mức giá.  
                Đừng quên sử dụng thẻ quà tặng nhé!
              </p>
              <a
                href="https://5broslego.click/product"
                className="inline-block px-5 py-2 border border-gray-900 dark:border-gray-300 rounded-full font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-900 hover:text-white transition"
              >
                Mua ngay
              </a>
            </div>
          </div>

          {/* Thẻ 2 */}
          <div
            className="text-center bg-white/90 dark:bg-gray-800/80 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-transform duration-700 ease-in-out"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <img
              src={Img2}
              alt="Bài viết và cảm hứng"
              className="mx-auto w-full max-w-[350px] rounded-2xl shadow-md transform scale-95 transition-transform duration-700 ease-in-out hover:scale-105"
              data-aos="zoom-in"
            />
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Đọc thêm và khám phá!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 mb-5">
                Xem thư viện bài viết của chúng tôi để tìm thêm ý tưởng và nguồn cảm hứng mới.
              </p>
              <a
                href="https://jaysbrickblog.com/list-of-lego-sets-2025/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2 border border-gray-900 dark:border-gray-300 rounded-full font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-900 hover:text-white transition"
              >
                Khám phá
              </a>
            </div>
          </div>

          {/* Thẻ 3 */}
          <div
            className="text-center bg-white/90 dark:bg-gray-800/80 p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-transform duration-700 ease-in-out"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <img
              src={Img3}
              alt="Sự kiện đặc biệt"
              className="mx-auto w-full max-w-[350px] rounded-2xl shadow-md transform scale-95 transition-transform duration-700 ease-in-out hover:scale-105"
              data-aos="zoom-in"
            />
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Đừng bỏ lỡ!
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-3 mb-5">
                Hãy đón xem sự kiện Black Friday để khám phá bộ sưu tập mới nhất của chúng tôi.
              </p>
              <a
                href="https://www.lego.com/en-us/black-friday-deals"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-5 py-2 border border-gray-900 dark:border-gray-300 rounded-full font-medium text-gray-900 dark:text-gray-200 hover:bg-gray-900 hover:text-white transition"
              >
                Tìm hiểu thêm
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiscoverMore;
