import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { FaTrash } from "react-icons/fa";
import api from "../services/api";
import { useCart } from '../contexts/CartContext'; // Thêm import này

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const { updateCartCount } = useCart(); // Thêm dòng này

  // Thêm state apiUrl
  const [apiUrl] = useState(import.meta.env.VITE_API_URL);
  
  // Thêm hàm getImageUrl
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
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    try {
      const response = await api.get('/cart');
      const formattedItems = response.data.items.map(item => ({
        productId: item.product._id,
        name: item.product.name,
        price: item.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl[0],
      }));
      setCart(formattedItems);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (item, delta) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity === 0) {
      setProductToDelete(item);
      setShowConfirmDialog(true);
    } else {
      await updateQuantity(item.productId, newQuantity);
      // Cập nhật số lượng giỏ hàng sau khi thay đổi quantity
      updateCartCount();
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      if (newQuantity < 1) {
        await api.delete(`/cart/remove/${productId}`);
      } else {
        await api.put('/cart/update', {
          productId,
          quantity: newQuantity
        });
      }
      await fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      alert(error.response?.data?.message || 'Không thể cập nhật giỏ hàng');
    }
  };

  const handleDelete = (item) => {
    setProductToDelete(item);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async (confirmed) => {
    if (confirmed && productToDelete) {
      try {
        await api.delete(`/cart/remove/${productToDelete.productId}`);
        await fetchCart();
        
        // Cập nhật số lượng giỏ hàng ngay sau khi xóa thành công
        updateCartCount();
        
        setShowConfirmDialog(false);
        setProductToDelete(null);

        // Show success message
        setSuccessMessage(`Đã xóa "${productToDelete.name}" khỏi giỏ hàng`);
        setShowSuccessMessage(true);
        setTimeout(() => setShowSuccessMessage(false), 3000);
      } catch (error) {
        console.error('Error removing item:', error);
        alert('Không thể xóa sản phẩm. Vui lòng thử lại sau.');
      }
    } else {
      setShowConfirmDialog(false);
      setProductToDelete(null);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fef9f4] flex items-center justify-center">
        <p className="text-xl text-[#3d1f00]">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef9f4] text-[#3d1f00] py-12 px-6">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p>{successMessage}</p>
          </div>
        </div>
      )}

      {/* Confirm Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Xác nhận xóa sản phẩm
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Bạn có chắc chắn muốn xóa <span className="font-medium text-red-500">"{productToDelete?.name}"</span> khỏi giỏ hàng?
                  </p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => handleConfirmDelete(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  Hủy
                </button>
                <button
                  onClick={() => handleConfirmDelete(true)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  Xóa sản phẩm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">🛒 Giỏ hàng của bạn</h1>

        {cart.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            Giỏ hàng trống. <Link to="/product" className="underline text-[#d63031]">Quay về mua hàng</Link>
          </p>
        ) : (
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={item.productId} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={getImageUrl(item.imageUrl)}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      console.log("Lỗi tải hình:", e.target.src);
                      e.target.onerror = null;
                      e.target.src = '/no-image.png';
                    }}
                  />
                  <div>
                    <p className="text-lg font-semibold">{item.name}</p>
                    <p className="text-sm text-gray-500">{item.price.toLocaleString()} VNĐ</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleQuantityChange(item, -1)}
                      className="bg-gray-200 hover:bg-gray-300 rounded px-3 text-lg"
                    >
                      −
                    </button>
                    <span className="font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item, 1)}
                      className="bg-gray-200 hover:bg-gray-300 rounded px-3 text-lg"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleDelete(item)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                    title="Xóa sản phẩm"
                  >
                    <FaTrash size={16} />
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
              <button
                onClick={() => navigate('/payment')}
                className="bg-[#d63031] text-white px-6 py-3 rounded-lg text-lg font-bold hover:bg-[#c0392b] transition"
              >
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