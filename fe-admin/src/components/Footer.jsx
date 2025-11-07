import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#fdf8f0] text-[#3d1f00] py-6 border-t border-[#e2d1b5]">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Admin Dashboard. All rights reserved.
        </p>
        <p className="text-sm mt-2">
          Designed by <span className="font-semibold">5BROSLEGO</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
