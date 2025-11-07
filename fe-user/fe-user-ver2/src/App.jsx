// Nhập các thư viện và component cần thiết
import React, { Fragment } from "react"; // Thư viện React
import Hero from "./components/Hero/Hero"; // Component Hero (phần tiêu đề chính của trang)
import Navbar from "./components/Navbar/Navbar"; // Component thanh điều hướng (menu trên đầu)
import Services from "./components/Services/Services.jsx"; // Component dịch vụ
import Banner from "./components/Banner/Banner.jsx"; // Component banner quảng cáo hoặc thông báo
import AppStore from "./components/AppStore/AppStore.jsx"; // Component giới thiệu liên kết đến App Store
import CoverBanner from "./components/CoverBanner/CoverBanner.jsx"; // Banner phụ, có thể dùng để che hoặc làm nổi bật nội dung
import Testimonial from "./components/Testimonial/Testimonial.jsx"; // Component phản hồi từ người dùng/khách hàng
import Footer from "./components/Footer/Footer.jsx"; // Component chân trang (footer)
import AOS from "aos"; // Thư viện animation on scroll (AOS) để tạo hiệu ứng khi cuộn trang
import "aos/dist/aos.css"; // Nhập file CSS của AOS để hiệu ứng hiển thị đúng
import { Route, Routes } from "react-router-dom";
import { privateRoute } from "./routes/index.jsx";
import DefaultLayout from "./layouts/DefaultLayout.jsx";

// Khai báo component App chính
const App = () => {
  // Hook useEffect để khởi tạo thư viện AOS khi component được render lần đầu tiên
  React.useEffect(() => {
    AOS.init({
      offset: 100,         // Khoảng cách bắt đầu animation khi cuộn đến (100px)
      duration: 500,       // Thời gian thực hiện animation (500ms)
      easing: "ease-in-sine", // Kiểu chuyển động
      delay: 100,          // Độ trễ trước khi animation bắt đầu
    });
    AOS.refresh(); // Cập nhật lại AOS để đảm bảo mọi thành phần được áp dụng đúng hiệu ứng
  }, []); // Mảng rỗng nghĩa là effect chỉ chạy một lần sau khi component được mount

  
  // Trả về giao diện chính của ứng dụng
  return <>
  <Routes>
    {privateRoute.map((route, index) => {
      const Page = route.element;

      let Layout = DefaultLayout;

      if (route.layout) {
        Layout = route.layout;
      } else if (route.layout === null) {
        Layout = Fragment;
      }
      
      return (
      <Route 
        key={index} 
        path={route.path} 
        element={<Layout><Page /></Layout>}/>)
    })}
  </Routes>
    
  </>;
};

// Xuất component App để sử dụng ở nơi khác (thường là index.js)
export default App;


