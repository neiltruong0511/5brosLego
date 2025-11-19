import React from 'react'
import Hero from '../components/Hero/Hero'
import Services from '../components/Services/Services'
import Banner from '../components/Banner/Banner'
import AppStore from '../components/AppStore/AppStore'
import Testimonial from '../components/Testimonial/Testimonial'


import About from '../pages/About/About' 

const Home = () => {
  return (
    <div>
      {/* Component phần tiêu đề chính */}
      <Hero />

      {/* About */}
      <About />

      {/* Component giới thiệu dịch vụ */}
      <Services />

      {/* Banner đầu tiên */}
      <Banner />

      {/* Liên kết đến App Store */}
      <AppStore />

      {/* Phản hồi khách hàng */}
      <Testimonial />
    </div>
  )
}

export default Home