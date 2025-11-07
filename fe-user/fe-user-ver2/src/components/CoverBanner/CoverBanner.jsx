// Import React từ thư viện 'react'.
import React from "react";
// Import hình ảnh nền (background image) từ thư mục assets.
import bgCoverImg from "../../assets/background.jpg";

// Component CoverBanner hiển thị một banner với hình nền và tiêu đề.
const CoverBanner = () => {
  // Định nghĩa đối tượng style cho hình nền của banner
  const bgImage = {
    backgroundImage: `url(${bgCoverImg})`, // Cung cấp đường dẫn hình ảnh nền.
    backgroundPosition: "center", // Đặt vị trí của hình nền ở trung tâm.
    backgroundRepeat: "no-repeat", // Hình nền sẽ không lặp lại.
    backgroundSize: "cover", // Hình nền sẽ phủ hết không gian của phần tử.
    // backgroundAttachment: "fixed", // Hình nền sẽ cố định khi cuộn trang (dòng này bị comment).
    height: "400px", // Chiều cao của phần banner.
    width: "100%", // Chiều rộng chiếm toàn bộ chiều rộng của phần tử cha.
  };

  return (
    // Phần tử div bao bọc banner với style nền được áp dụng.
    <div style={bgImage}>
      {/* Đặt một div chứa tiêu đề, căn giữa nội dung với màu chữ trắng */}
      <div className="h-[200px] flex justify-center items-center text-white">
        {/* Tiêu đề với kích thước chữ 3xl trên màn hình nhỏ và 4xl trên màn hình lớn */}
        <h1 className="text-3xl sm:text-4xl font-bold">
          Wolsom là lựa chọn tốt nhất!!!
        </h1>
      </div>
    </div>
  );
};

// Xuất component CoverBanner để có thể sử dụng ở phần khác của ứng dụng.
export default CoverBanner;
