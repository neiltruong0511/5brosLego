import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'

const DefaultLayout = ({children}) => {
  return (
    <div className="bg-white dark:bg-gray-900 dark:text-white duration-200">
      {/* Component thanh điều hướng */}
      <Navbar />
      
      {children}
      
      <Footer />
    </div>
  )
}

export default DefaultLayout