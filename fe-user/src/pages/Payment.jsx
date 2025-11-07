import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import qrBank from '../assets/QR_Bank.png';
import qrMomo from '../assets/QR_MoMo.png';

const Payment = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("COD"); // COD | QR_BANK | QR_MOMO

  const [formData, setFormData] = useState({
    email: user?.email || '',
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    note: ''
  });

  const [apiUrl] = useState(import.meta.env.VITE_API_URL || 'http://localhost:5000');
  
  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.includes('gojekapi.com')) return url;
    if (url.startsWith('/uploads')) return `${apiUrl}${url}`;
    return `${apiUrl}/uploads/${url.replace('/uploads/', '')}`;
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCartData();
  }, [user, navigate]);

  const fetchCartData = async () => {
    try {
      const response = await api.get('/cart');
      const formattedItems = response.data.items.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl[0],
      }));
      setCartItems(formattedItems);
      const total = formattedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotalAmount(total);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!formData.email || !formData.name || !formData.phone || !formData.address) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
      }

      const orderData = {
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          note: formData.note
        },
        paymentMethod,
        totalAmount
      };

      const response = await api.post('/orders', orderData);

      if (response.data) {
        if (paymentMethod !== "COD") {
          alert("Cảm ơn bạn! Thanh toán của bạn đã được xác nhận.");
        }
        navigate('/thankyou', { state: { orderId: response.data._id } });
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert(error.response?.data?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Đang tải...</div>;
  }

  const renderQRCode = () => {
    switch (paymentMethod) {
      case "QR_BANK":
        return qrBank;
      case "QR_MOMO":
        return qrMomo;
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#fef9f4] min-h-screen p-6 text-[#3d1f00]">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form thông tin người nhận */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-bold">Thông tin nhận hàng</h2>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Họ và tên"
            className="w-full p-2 border rounded"
          />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Số điện thoại"
            className="w-full p-2 border rounded"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Địa chỉ"
            className="w-full p-2 border rounded"
          />
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            placeholder="Ghi chú"
            className="w-full p-2 border rounded"
          />

          {/* Phương thức thanh toán */}
          <div>
            <h2 className="text-xl font-bold mt-4 mb-2">Phương thức thanh toán</h2>
            <div className="space-y-3">
              {/* COD */}
              <label className="flex items-center gap-2 border p-3 rounded cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-[#3d1f00]"
                />
                Thanh toán khi nhận hàng (COD)
              </label>

              {/* QR Ngân hàng */}
              <label className="flex items-center gap-2 border p-3 rounded cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="QR_BANK"
                  checked={paymentMethod === "QR_BANK"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-[#3d1f00]"
                />
                Thanh toán qua QR Ngân hàng (VietQR)
              </label>

              {/* QR MoMo */}
              <label className="flex items-center gap-2 border p-3 rounded cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="QR_MOMO"
                  checked={paymentMethod === "QR_MOMO"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="accent-[#3d1f00]"
                />
                Thanh toán qua MoMo QR
              </label>

              {/* Hiển thị QR khi chọn */}
              {paymentMethod !== "COD" && (
                <div className="border p-4 rounded-lg text-center bg-white">
                  <p className="font-medium mb-2">Quét mã để thanh toán</p>
                  <img
                    src={renderQRCode()}
                    alt="QR Thanh toán"
                    className="mx-auto w-56 h-56 object-contain border rounded-lg"
                  />
                  <p className="text-sm mt-2 text-gray-600">
                    Số tiền: <span className="font-semibold">{totalAmount.toLocaleString()}đ</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Thông tin đơn hàng */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Đơn hàng ({cartItems.length} sản phẩm)</h2>
          {cartItems.map((item) => (
            <div key={item.productId} className="flex items-center gap-4">
              <img
                src={getImageUrl(item.imageUrl)}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/no-image.png';
                }}
              />
              <div className="flex-1">
                <p className="font-medium">{item.name}</p>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600">x{item.quantity}</p>
                  <p className="font-semibold">{item.price.toLocaleString()}đ</p>
                </div>
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
          <button
            onClick={handleSubmit}
            className="w-full bg-[#b78a68] text-white py-2 rounded hover:opacity-90 transition"
          >
            {paymentMethod === "COD" ? "Đặt hàng" : "Xác nhận thanh toán"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
