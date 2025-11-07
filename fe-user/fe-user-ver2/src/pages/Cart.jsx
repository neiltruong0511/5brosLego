import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialCart = [
  {
    name: "Cà phê sữa",
    price: 35000,
    image: "caphesua.png",
    quantity: 2,
  },
  {
    name: "Trà Lipton chanh",
    price: 30000,
    image: "tralipton.png",
    quantity: 1,
  },
];

const Cart = () => {
  const [cart, setCart] = useState(initialCart);

  const updateQuantity = (index, delta) => {
    const updated = [...cart];
    updated[index].quantity += delta;
    if (updated[index].quantity <= 0) {
      updated.splice(index, 1); // xóa sản phẩm nếu quantity <= 0
    }
    setCart(updated);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#fef9f4] text-[#3d1f00] py-12 px-6">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">🛒 Giỏ hàng của bạn</h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Giỏ hàng trống. <Link to="/product" className="underline text-[#d63031]">Quay về mua hàng</Link>
          </p>
        ) : (
          <div className="space-y-6">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={`/images/${item.image}`}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                  <div>
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.price.toLocaleString()} VNĐ</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(index, -1)}
                    className="bg-gray-200 hover:bg-gray-300 rounded px-3 text-lg"
                  >
                    −
                  </button>
                  <span className="font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(index, 1)}
                    className="bg-gray-200 hover:bg-gray-300 rounded px-3 text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center pt-6 border-t mt-6">
              <h2 className="text-xl font-bold">Tổng cộng:</h2>
              <p className="text-xl font-semibold text-[#d63031]">
                {total.toLocaleString()} VNĐ
              </p>
            </div>

            <div className="text-center mt-8">
              <button className="bg-[#d63031] text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-[#c0392b] transition">
                THANH TOÁN
              </button>
              <p className="text-sm text-gray-500 mt-2">
                <Link to="/product" className="underline">← Tiếp tục mua sắm</Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;