import React, { useState, useEffect } from 'react';

const Payment = () => {
  // State lưu trữ giỏ hàng
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  // Giả lập việc gọi API để lấy thông tin giỏ hàng
  useEffect(() => {
    const fetchCartData = async () => {
      // Giả lập dữ liệu API
      const response = [
        {
          id: 1,
          name: 'Matcha Latte',
          price: 60000,
          quantity: 1,
          image: 'https://via.placeholder.com/60',
        },
        // Có thể thêm các sản phẩm khác vào đây
      ];

      // Cập nhật giỏ hàng và tính tổng số tiền
      setCartItems(response);
      const total = response.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalAmount(total);
    };

    fetchCartData();
  }, []);

  return (
    <div className="bg-[#fef9f4] min-h-screen p-6 text-[#3d1f00]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Thông tin nhận hàng */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Thông tin nhận hàng</h2>
          <input type="email" placeholder="Email" className="w-full p-2 border rounded" />
          <input type="text" placeholder="Họ và tên" className="w-full p-2 border rounded" />
          <input type="tel" placeholder="Số điện thoại" className="w-full p-2 border rounded" />
          <input type="text" placeholder="Địa chỉ" className="w-full p-2 border rounded" />
          <textarea placeholder="Ghi chú" className="w-full p-2 border rounded"></textarea>

          {/* Phương thức thanh toán */}
          <div>
            <h2 className="text-xl font-bold mt-4 mb-2">Phương thức thanh toán</h2>
            <div className="border p-4 rounded">
              <label className="flex items-center gap-2">
                <input type="radio" checked readOnly className="accent-[#3d1f00]" />
                Thanh toán khi nhận hàng (COD)
              </label>
            </div>
          </div>
        </div>

        {/* Đơn hàng */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Đơn hàng ({cartItems.length} sản phẩm)</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <img src={item.image} alt={item.name} className="w-16 h-16 rounded" />
              <div>
                <p>{item.name}</p>
                <p className="font-semibold">{item.price.toLocaleString()}đ</p>
              </div>
            </div>
          ))}
          <hr />
          <div className="flex justify-between">
            <span>Tạm tính</span>
            <span>{totalAmount.toLocaleString()}đ</span>
          </div>
          <div className="flex justify-between">
            <span>Phí vận chuyển</span>
            <span>-</span>
          </div>
          <hr />
          <div className="flex justify-between font-bold text-lg">
            <span>Tổng cộng</span>
            <span>{totalAmount.toLocaleString()}đ</span>
          </div>
          <button className="w-full bg-[#b78a68] text-white py-2 rounded hover:opacity-90 transition">
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;