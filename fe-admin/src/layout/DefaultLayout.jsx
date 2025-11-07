
import React from "react";
import Footer from "../components/Footer";

const DefaultLayout = ({ children }) => {
  return (
    <div>
      {/* Không render Navbar ở đây */}
      <main>{children}</main>
     
    </div>
  );
};

export default DefaultLayout;