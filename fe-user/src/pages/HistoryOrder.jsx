import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { FaBox, FaClock, FaTruck, FaCheck, FaTimes } from 'react-icons/fa';

const HistoryOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [review, setReview] = useState({
    rating: 0,
    comment: ''
  });
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [reviewedProducts, setReviewedProducts] = useState([]);
  const [apiUrl] = useState(import.meta.env.VITE_API_URL);

  const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.includes('gojekapi.com')) return url;
    if (url.startsWith('/uploads')) return `${apiUrl}${url}`;
    return `${apiUrl}/uploads/${url.replace('/uploads/', '')}`;
  };

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/history-order' } });
      return;
    }
    fetchOrders();
  }, [user]);

  useEffect(() => {
    const fetchReviews = async () => {
        try {
            const response = await api.get('/reviews/user');
            const reviewedIds = response.data.map(review => review.product);
            setReviewedProducts(reviewedIds);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    if (user) {
        fetchReviews();
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/myorders');
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (status) => {
    return {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'shipping': 'Đang giao',
      'shipped': 'Đã giao',
      'cancelled': 'Đã hủy'
    }[status] || status;
  };

  const getStatusColor = (status) => {
    return {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipping': 'bg-orange-100 text-orange-800',
      'shipped': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    }[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'pending': <FaBox className="text-yellow-500" />,
      'processing': <FaClock className="text-blue-500" />,
      'shipping': <FaTruck className="text-orange-500" />,
      'shipped': <FaCheck className="text-green-500" />,
      'cancelled': <FaTimes className="text-red-500" />
    };
    return icons[status] || null;
  };

  const handleCancelOrder = async (orderId) => {
    setSelectedOrderId(orderId);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    try {
      await api.put(`/orders/cancel/${selectedOrderId}`);
      setShowCancelModal(false);
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Không thể hủy đơn hàng. Vui lòng thử lại sau.');
    }
  };

  const handleOpenReview = (order, item) => {
    setSelectedProduct({
      orderId: order._id,
      productId: item.product._id,
      name: item.name,
      imageUrl: item.product.imageUrl[0]
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
        const response = await api.post('/reviews/create', {
            orderId: selectedProduct.orderId,
            productId: selectedProduct.productId,
            rating: review.rating,
            comment: review.comment
        });

        if (response.status === 201) {
            setShowReviewModal(false);
            setReview({ rating: 0, comment: '' });
            setShowSuccessModal(true);
            setReviewedProducts([...reviewedProducts, selectedProduct.productId]);
            // Auto hide success modal after 3 seconds
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
        }
    } catch (error) {
        console.error('Error submitting review:', error);
        alert(error.response?.data?.message || 'Không thể gửi đánh giá');
    }
  };

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.orderStatus === selectedStatus);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#b78a68]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fef9f4] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#3d1f00] mb-4">Đơn Hàng Của Tôi</h1>
          <p className="text-gray-600">Theo dõi và quản lý đơn hàng của bạn</p>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-full ${
              selectedStatus === 'all' 
                ? 'bg-[#b78a68] text-white' 
                : 'bg-white text-[#3d1f00] hover:bg-[#f1e4d1]'
            } transition-colors duration-200`}
          >
            Tất cả đơn hàng
          </button>
          {['pending', 'processing', 'shipping', 'shipped', 'cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                selectedStatus === status 
                  ? 'bg-[#b78a68] text-white' 
                  : 'bg-white text-[#3d1f00] hover:bg-[#f1e4d1]'
              } transition-colors duration-200`}
            >
              {getStatusIcon(status)}
              {getStatusText(status)}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <p className="text-gray-500 mb-4">Không có đơn hàng nào</p>
            <Link
              to="/product"
              className="inline-block px-6 py-3 bg-[#b78a68] text-white rounded-full hover:bg-[#8b593c] transition-colors"
            >
              Mua sắm ngay
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-xl shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                {/* Order Header */}
                <div className="p-4 border-b bg-[#ffd7af]">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-600">
                        Mã đơn hàng: <span className="font-medium">{order._id}</span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-2 ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      {getStatusText(order.orderStatus)}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-4">
                  {order.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center gap-4 py-4 border-b last:border-0"
                    >
                      <img
                        src={getImageUrl(item.product?.imageUrl[0])}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          console.log("Lỗi tải hình:", e.target.src);
                          e.target.onerror = null;
                          e.target.src = '/no-image.png';
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-[#3d1f00]">{item.name}</h3>
                        <p className="text-sm text-gray-600">
                          Số lượng: {item.quantity} x {item.price.toLocaleString()}đ
                        </p>
                      </div>
                      {order.orderStatus === 'shipped' && (
                        <button
                          onClick={() => handleOpenReview(order, item)}
                          disabled={reviewedProducts.includes(item.product._id)}
                          className={`px-4 py-2 rounded-full text-sm transition-colors ${
                              reviewedProducts.includes(item.product._id)
                                  ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                  : 'bg-[#b78a68] text-white hover:bg-[#8b593c]'
                          }`}
                        >
                          {reviewedProducts.includes(item.product._id) ? 'Đã đánh giá' : 'Đánh giá'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Order Footer */}
                <div className="p-4 bg-white border-t">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[#3d1f00]">
                        Tổng tiền: {" "}
                        <span className="font-bold text-lg">
                          {order.totalAmount.toLocaleString()}đ
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        Thanh toán khi nhận hàng (COD)
                      </p>
                    </div>
                    
                    {order.orderStatus === 'pending' && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 text-sm transition-colors"
                      >
                        Hủy đơn hàng
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 relative">
            {/* Close button */}
            <button 
              onClick={() => setShowReviewModal(false)}
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Review Form */}
            <form onSubmit={handleSubmitReview} className="space-y-6">
              <div className="flex items-center gap-4">
                <img 
                  src={getImageUrl(selectedProduct?.imageUrl)} 
                  alt={selectedProduct?.name}
                  className="w-20 h-20 object-cover rounded-lg"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/no-image.png';
                  }}
                />
                <div>
                  <h3 className="font-semibold text-lg">{selectedProduct?.name}</h3>
                  <p className="text-sm text-gray-500">Đánh giá sản phẩm</p>
                </div>
              </div>

              {/* Star Rating */}
              <div className="flex flex-col items-center gap-2">
                <p className="text-sm text-gray-600">Chọn số sao đánh giá</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReview(prev => ({ ...prev, rating: star }))}
                      className={`text-3xl ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:text-yellow-400 transition-colors`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {review.rating ? `Bạn đã đánh giá ${review.rating} sao` : 'Chưa đánh giá'}
                </p>
              </div>

              {/* Comment Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhận xét của bạn
                </label>
                <textarea
                  value={review.comment}
                  onChange={(e) => setReview(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  required
                  rows="4"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-[#b78a68] focus:border-transparent resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[#b78a68] text-white rounded-lg hover:opacity-90 transition-colors"
                >
                  Gửi đánh giá
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaTimes className="text-red-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Xác nhận hủy đơn hàng
              </h3>
              <p className="text-gray-500">
                Bạn có chắc chắn muốn hủy đơn hàng này? 
                Hành động này không thể hoàn tác.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Không, giữ lại
              </button>
              <button
                onClick={confirmCancel}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Có, hủy đơn
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheck className="text-green-500 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Đánh giá thành công
              </h3>
              <p className="text-gray-500">
                Cảm ơn bạn đã đánh giá sản phẩm!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryOrder;