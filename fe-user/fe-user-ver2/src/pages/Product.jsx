import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
const products = [
  // Trang 1
  { name: "MATCHA LATTE", price: "60.000đ", image: "matcha.png" },
  { name: "Cà phê đen", price: "35.000đ", image: "capheden.png" },
  { name: "Cà phê sữa", price: "35.000đ", image: "caphesua.png" },
  { name: "Bạc xỉu đá", price: "35.000đ", image: "bacxiu.png" },
  { name: "COMBO cà phê sữa & cà phê đen", price: "60.000đ", image: "combo1.png" },
  { name: "Cà phê quế", price: "40.000đ", image: "capheque.png" },
  { name: "Cà phê đen me đá", price: "45.000đ", image: "caphemeda.png" },
  { name: "Trà Lipton chanh", price: "30.000đ", image: "tralipton.png" },
  { name: "Trà nho đen", price: "55.000đ", image: "tranhoden.png" },
  { name: "COMBO cà phê sữa quế & cà phê đen", price: "40.000đ", image: "combo2.png" },

  // Trang 2
  { name: "Cà phê đen 1L", price: "75.000đ", image: "capheden1l.png" },
  { name: "Cà phê sữa 1L", price: "75.000đ", image: "caphesua1l.png" },
  { name: "Matcha latte", price: "90.000đ", image: "matcha2.png" },
  { name: "COMBO 5 ly cà phê sữa", price: "55.000đ", image: "combo5ly.png" },
  { name: "Cà phê đen quế", price: "45.000đ", image: "capheque2.png" },
  { name: "Cà phê me đá 1L", price: "75.000đ", image: "caphemeda1l.png" },
  { name: "Cà phê sữa 1L", price: "75.000đ", image: "caphesua1l.png" },
  { name: "Matcha latte", price: "90.000đ", image: "matcha2.png" },
  { name: "COMBO 10 ly cà phê sữa", price: "170.000đ", image: "combo10ly.png" },
  { name: "Cà phê đen me đá", price: "45.000đ", image: "caphedenmeda.png" },
];

const Product = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = products.slice(startIndex, startIndex + itemsPerPage);

  const handleClick = (product, index) => {
    navigate(`/product/${startIndex + index}`, { state: product });
  };

  return (
    <div className="bg-[#fdf8f0] px-8 py-12 font-sans">
      <h1 className="text-2xl font-bold text-center text-[#6b3f24] mb-10">TẤT CẢ SẢN PHẨM</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 max-w-3xl mx-auto">
        {currentItems.map((product, index) => (
          <div
            key={index}
            onClick={() => handleClick(product, index)}
            className="flex items-center gap-4 cursor-pointer hover:bg-[#f1e9dd] p-2 rounded-md transition"
          >
            <img
              src={`images/${product.image}`}
              alt={product.name}
              className="w-14 h-14 object-cover rounded-full border"
            />
            <div className="flex-1 border-b border-dotted border-gray-400">
              <span className="font-semibold text-sm text-[#6b3f24]">{product.name}</span>
            </div>
            <span className="ml-2 font-bold text-[#6b3f24] whitespace-nowrap">{product.price}</span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 rounded-full border text-sm flex items-center justify-center ${
              currentPage === i + 1 ? "bg-[#6b3f24] text-white" : "bg-white text-[#6b3f24]"
            }`}
          >
            {i + 1}
          </button>
        ))}
        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="w-8 h-8 rounded-full border bg-white text-[#6b3f24] text-sm flex items-center justify-center"
          >
            &rarr;
          </button>
        )}
      </div>
    </div>
  );
};
export default Product;