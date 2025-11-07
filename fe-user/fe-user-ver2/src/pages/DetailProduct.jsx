import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";

const products = [
  { name: "MATCHA LATTE", price: "60000", image: "matcha.png" },
  { name: "Cà phê đen", price: "35000", image: "capheden.png" },
  { name: "Cà phê sữa", price: "35000", image: "caphesua.png" },
  { name: "Bạc xỉu đá", price: "35000", image: "bacxiu.png" },
  { name: "COMBO cà phê sữa & cà phê đen", price: "60000", image: "combo1.png" },
  { name: "Cà phê quế", price: "40000", image: "capheque.png" },
  { name: "Cà phê đen me đá", price: "45000", image: "caphemeda.png" },
  { name: "Trà Lipton chanh", price: "30000", image: "tralipton.png" },
  { name: "Trà nho đen", price: "55000", image: "tranhoden.png" },
  { name: "COMBO cà phê sữa quế & cà phê đen", price: "40000", image: "combo2.png" },
  { name: "Cà phê đen 1L", price: "75000", image: "capheden1l.png" },
  { name: "Cà phê sữa 1L", price: "75000", image: "caphesua1l.png" },
  { name: "Matcha latte", price: "90000", image: "matcha2.png" },
  { name: "COMBO 5 ly cà phê sữa", price: "55000", image: "combo5ly.png" },
  { name: "Cà phê đen quế", price: "45000", image: "capheque2.png" },
  { name: "Cà phê me đá 1L", price: "75000", image: "caphemeda1l.png" },
  { name: "Cà phê sữa 1L", price: "75000", image: "caphesua1l.png" },
  { name: "Matcha latte", price: "90000", image: "matcha2.png" },
  { name: "COMBO 10 ly cà phê sữa", price: "170000", image: "combo10ly.png" },
  { name: "Cà phê đen me đá", price: "45000", image: "caphedenmeda.png" },
];

const DetailProduct = () => {
  const { id } = useParams();
  const productIndex = parseInt(id);
  const product = products[productIndex] || products[0];
  const [quantity, setQuantity] = useState(1);
  const [showMessage, setShowMessage] = useState(false);
  const basePrice = parseInt(product.price);
  const totalPrice = basePrice * quantity;

  const [startIndex, setStartIndex] = useState(0);

  const handleNext = () => {
    setStartIndex((startIndex + 1) % products.length);
  };

  const handlePrev = () => {
    setStartIndex((startIndex - 1 + products.length) % products.length);
  };

  const otherProducts = [];
  let i = startIndex;
  while (otherProducts.length < 3) {
    if (i === productIndex) {
      i = (i + 1) % products.length;
      continue;
    }
    otherProducts.push({ ...products[i], id: i });
    i = (i + 1) % products.length;
  }

  if (!product) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-bold text-red-600">
          Sản phẩm không tồn tại!
        </h2>
        <Link to="/" className="text-blue-600 underline mt-4 inline-block">
          Quay về trang sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 text-[#3d1f00] bg-white">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Hình ảnh sản phẩm */}
        <div className="flex justify-center">
          <img
            src="https://www.highlandscoffee.com.vn/vnt_upload/product/06_2023/HLC_New_logo_5.1_Products__TRA_SEN_VANG_CU_NANG.jpg"
            alt={product.name}
            className="w-[300px] h-auto object-cover shadow-lg"
          />
        </div>

        {/* Thông tin sản phẩm */}
        <div>
          <h1 className="text-3xl font-bold mb-4 uppercase">{product.name}</h1>
          <p className="text-sm text-gray-700 mb-6 leading-relaxed">
            {product.description ||
              "Thức uống đặc biệt, thơm ngon cho mọi lứa tuổi."}
          </p>

          <div className="mb-4">
            <label className="block font-semibold mb-2">Số lượng:</label>
            <div className="w-32 h-12 rounded-full border border-gray-300 flex items-center justify-between px-4">
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className="w-8 h-8 border rounded-full flex items-center justify-center text-lg hover:bg-gray-200"
              >
                −
              </button>
              <span className="w-8 h-8 border rounded-full flex items-center justify-center text-lg">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="w-8 h-8 border rounded-full flex items-center justify-center text-lg hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          <p className="mt-4 text-lg font-semibold">
            Tổng giá: {totalPrice.toLocaleString()} VNĐ
          </p>

          <button
            className="mt-6 bg-[#d63031] text-white px-6 py-3 rounded text-lg font-bold hover:bg-[#c0392b] transition"
            onClick={() => {
              setShowMessage(true);
              setTimeout(() => setShowMessage(false), 3000);
            }}
          >
            THÊM GIỎ HÀNG
          </button>

          {showMessage && (
            <div
            className={`fixed top-20 right-1 bg-green-500 text-white px-4 py-3 rounded shadow-lg z-50 animate-fade-in ${
              !showMessage ? "animate-fade-out" : ""
            }`}
          >
            ✅ Đã thêm vào giỏ hàng thành công!
          </div>
          )}
        </div>
      </div>

      {/* Sản phẩm khác */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Sản phẩm khác</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="text-xl px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            &#8592;
          </button>

          <div className="flex gap-4 w-full">
            {otherProducts.map((item) => (
              <Link
                to={`/product/${item.id}`}
                key={item.id}
                className="w-1/3 border rounded p-2 hover:shadow transition"
              >
                <img
                  src={`/images/${item.image}`}
                  alt={item.name}
                  className="h-32 w-full object-cover rounded mb-2"
                />
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  {parseInt(item.price).toLocaleString()} VNĐ
                </p>
              </Link>
            ))}
          </div>

          <button
            onClick={handleNext}
            className="text-xl px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailProduct;
