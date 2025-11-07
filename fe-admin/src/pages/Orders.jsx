import React, { useState, useEffect } from "react";
import api from "../services/api";
import { format, isThisMonth } from "date-fns";
import { vi } from "date-fns/locale";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    processingOrders: 0,
    shippingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    newOrdersThisMonth: 0,
  });

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        message: "",
        type: "",
      });
    }, 3000);
  };

  useEffect(() => {
    fetchOrders();
    fetchOrderStats();
  }, [currentPage]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/orders/all?page=${currentPage}`);
      
      // Map qua các đơn hàng để đảm bảo đơn hàng đã giao sẽ được đánh dấu là đã thanh toán
      const processedOrders = response.data.orders.map(order => {
        if (order.orderStatus === 'shipped') {
          return {
            ...order,
            isPaid: true,
            paidAt: order.paidAt || new Date()
          };
        }
        return order;
      });
      
      setOrders(processedOrders);
      setTotalPages(response.data.pages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Không thể tải danh sách đơn hàng. Vui lòng thử lại sau.");
      setLoading(false);
    }
  };

  // Cập nhật hàm fetchOrderStats
  const fetchOrderStats = async () => {
    try {
      setLoading(true);
      
      // Gọi API analytics để lấy số liệu tổng quan
      const response = await api.get('/orders/analytics');
      
      if (response.data) {
        // Cập nhật state với dữ liệu từ API
        setOrderStats({
          totalOrders: response.data.totalOrders || 0,
          pendingOrders: response.data.pendingOrders || 0,
          processingOrders: response.data.processingOrders || 0,
          shippingOrders: response.data.shippingOrders || 0,
          deliveredOrders: response.data.deliveredOrders || 0,
          cancelledOrders: response.data.cancelledOrders || 0,
          totalRevenue: response.data.totalRevenue || 0,
          newOrdersThisMonth: response.data.newOrdersThisMonth || 0
        });
        
        console.log("Order stats fetched from API:", response.data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching order statistics:", error);
      
      // Nếu API analytics thất bại, thử gọi API count-by-status
      try {
        const countResponse = await api.get('/orders/count-by-status');
        if (countResponse.data) {
          setOrderStats({
            totalOrders: countResponse.data.total || 0,
            pendingOrders: countResponse.data.pending || 0,
            processingOrders: countResponse.data.processing || 0,
            shippingOrders: countResponse.data.shipping || 0,
            deliveredOrders: countResponse.data.shipped || 0,
            cancelledOrders: countResponse.data.cancelled || 0,
            totalRevenue: countResponse.data.revenue || 0,
            newOrdersThisMonth: countResponse.data.newThisMonth || 0
          });
        }
      } catch (countError) {
        console.error("Error with count-by-status API:", countError);
        
        // Nếu không thành công, tính toán từ orders đã có
        if (orders && orders.length > 0) {
          const pendingOrders = orders.filter(order => order.orderStatus === 'pending').length;
          const processingOrders = orders.filter(order => order.orderStatus === 'processing').length;
          const shippingOrders = orders.filter(order => order.orderStatus === 'shipping').length;
          const shippedOrders = orders.filter(order => order.orderStatus === 'shipped').length;
          const cancelledOrders = orders.filter(order => order.orderStatus === 'cancelled').length;
          
          setOrderStats({
            totalOrders: orders.length,
            pendingOrders,
            processingOrders,
            shippingOrders,
            deliveredOrders: shippedOrders,
            cancelledOrders,
            totalRevenue: orders
              .filter(order => order.orderStatus === 'shipped')
              .reduce((sum, order) => sum + (order.totalAmount || 0), 0),
            newOrdersThisMonth: orders.filter(order => {
              const orderDate = new Date(order.createdAt);
              return isThisMonth(orderDate);
            }).length
          });
        }
      }
      
      setLoading(false);
    }
  };

  // Format date to dd/MM/yyyy
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return format(new Date(timestamp), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return "Không hợp lệ";
    }
  };

  // Format price with dot separator
  const formatCurrency = (value) => {
    if (!value) return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "processing":
        return "text-blue-600 bg-blue-100";
      case "shipping":
        return "text-purple-600 bg-purple-100";
      case "shipped":
        return "text-green-600 bg-green-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Chờ xử lý";
      case "processing":
        return "Đang xử lý";
      case "shipping":
        return "Đang giao";
      case "shipped":
        return "Đã giao";
      case "cancelled":
        return "Đã hủy";
      default:
        return "Không xác định";
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      console.log("Changing status to:", newStatus);
      
      // Luôn tự động đánh dấu đã thanh toán nếu đơn hàng đã giao
      const isNowPaid = newStatus === 'shipped';
      
      // Cập nhật state UI trước
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order._id === orderId 
            ? {
                ...order,
                orderStatus: newStatus,
                isPaid: isNowPaid ? true : order.isPaid,  // Chỉ cập nhật nếu là shipped
                paidAt: isNowPaid ? new Date() : order.paidAt
              } 
            : order
        )
      );
      
      // Nếu đang xem chi tiết đơn hàng, cập nhật state selectedOrder
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          orderStatus: newStatus,
          isPaid: isNowPaid ? true : selectedOrder.isPaid,
          paidAt: isNowPaid ? new Date() : selectedOrder.paidAt
        });
      }
      
      // Gọi API để cập nhật backend
      const response = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      console.log("API response:", response.data);
      
      // Thông báo thành công
      showNotification("Cập nhật trạng thái đơn hàng thành công!", "success");
      
      // Cập nhật thống kê
      fetchOrderStats();
    } catch (error) {
      console.error("Error updating order status:", error);
      showNotification(
        error.response?.data?.message || "Không thể cập nhật trạng thái đơn hàng",
        "error"
      );
      
      // Nếu có lỗi, fetch lại orders để đồng bộ với backend
      fetchOrders();
    }
  };

  const viewOrderDetails = (order) => {
    // Đảm bảo rằng nếu order đã shipped thì cũng được đánh dấu là đã thanh toán
    const updatedOrder = order.orderStatus === 'shipped' 
      ? {...order, isPaid: true, paidAt: order.paidAt || new Date()} 
      : order;
      
    setSelectedOrder(updatedOrder);
  };

  // Filter orders based on search term
  const filteredOrders = orders.filter((order) => {
    return (
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (order.user?.email && order.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#6b3f24] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600">
        <p>{error}</p>
        <button
          onClick={fetchOrders}
          className="mt-4 bg-[#3d1f00] text-white px-4 py-2 rounded-md hover:bg-[#7a4b27] transition"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {notification.show && (
        <div
          className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transition-all duration-500 transform translate-x-0 ${
            notification.type === "success"
              ? "bg-green-100 text-green-800 border-l-4 border-green-500"
              : notification.type === "error"
              ? "bg-red-100 text-red-800 border-l-4 border-red-500"
              : "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500"
          }`}
        >
          <div className="flex items-center">
            {notification.type === "success" && (
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            )}
            {notification.type === "error" && (
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            )}
            {notification.type === "warning" && (
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                ></path>
              </svg>
            )}
            <p>{notification.message}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-[#3d1f00]">Quản Lý Đơn Hàng</h1>
      </div>

      {/* Thống kê đơn hàng */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-medium">Tổng Đơn Hàng</p>
              <h2 className="text-2xl font-bold text-blue-600">{orderStats.totalOrders || 0}</h2>
              <p className="text-sm text-green-500 mt-1">↑ 15%</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-medium">Đơn Hàng Mới</p>
              <h2 className="text-2xl font-bold text-yellow-600">{orderStats.pendingOrders || 0}</h2>
              <p className="text-sm text-red-500 mt-1">↑ 10%</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-medium">Đơn Đã Hoàn Thành</p>
              <h2 className="text-2xl font-bold text-green-600">{orderStats.deliveredOrders || 0}</h2>
              <p className="text-sm text-green-500 mt-1">↑ 18%</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-medium">Tổng Doanh Thu</p>
              <h2 className="text-2xl font-bold text-purple-600">{formatCurrency(orderStats.totalRevenue || 0)}đ</h2>
              <p className="text-sm text-green-500 mt-1">↑ 22%</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Thống kê chi tiết theo trạng thái */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-bold text-[#3d1f00] mb-4">Chi Tiết Đơn Hàng Theo Trạng Thái</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-yellow-100 p-4 rounded-lg text-center">
            <p className="text-yellow-700 font-semibold">Chờ xử lý</p>
            <p className="text-2xl font-bold text-yellow-600">{orderStats.pendingOrders || 0}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg text-center">
            <p className="text-blue-700 font-semibold">Đang xử lý</p>
            <p className="text-2xl font-bold text-blue-600">{orderStats.processingOrders || 0}</p>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg text-center">
            <p className="text-purple-700 font-semibold">Đang giao</p>
            <p className="text-2xl font-bold text-purple-600">{orderStats.shippingOrders || 0}</p>
          </div>
          <div className="bg-teal-100 p-4 rounded-lg text-center">
            <p className="text-teal-700 font-semibold">Đã giao</p>
            <p className="text-2xl font-bold text-teal-600">{orderStats.deliveredOrders || 0}</p>
          </div>
          <div className="bg-red-100 p-4 rounded-lg text-center">
            <p className="text-red-700 font-semibold">Đã hủy</p>
            <p className="text-2xl font-bold text-red-600">{orderStats.cancelledOrders || 0}</p>
          </div>
        </div>
      </div>

      {/* Tìm kiếm */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm theo mã đơn hàng, tên khách hàng hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#3d1f00]"
        />
      </div>

      {/* Bảng đơn hàng */}
      <div className="bg-[#fdf8f0] shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#3d1f00] text-white">
              <th className="p-4">Mã đơn hàng</th>
              <th className="p-4">Khách hàng</th>
              <th className="p-4">Ngày đặt</th>
              <th className="p-4">Tổng tiền</th>
              <th className="p-4">Trạng thái</th>
              <th className="p-4">Thanh toán</th>
              <th className="p-4">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-100">
                  <td className="p-4 font-medium">#{order._id.substring(order._id.length - 8)}</td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium">{order.user ? order.user.name : "N/A"}</p>
                      <p className="text-sm text-gray-500">{order.user ? order.user.email : "N/A"}</p>
                    </div>
                  </td>
                  <td className="p-4">{formatDate(order.createdAt)}</td>
                  <td className="p-4 font-medium">{formatCurrency(order.totalAmount)}đ</td>
                  <td className="p-4">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`p-2 rounded-md ${getStatusColor(order.orderStatus)}`}
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="processing">Đang xử lý</option>
                      <option value="shipping">Đang giao</option>
                      <option value="shipped">Đã giao</option>
                      <option value="cancelled">Đã hủy</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full ${
                      order.orderStatus === 'shipped' || order.isPaid 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {order.orderStatus === 'shipped' || order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => viewOrderDetails(order)}
                      className="bg-[#3d1f00] text-white px-3 py-1 rounded-md hover:bg-[#7a4b27] transition"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-4 text-center text-gray-500">
                  Không tìm thấy đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`w-10 h-10 rounded-full border text-sm flex items-center justify-center ${
                currentPage === i + 1
                  ? "bg-[#3d1f00] text-white"
                  : "bg-white text-[#3d1f00]"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

      {/* Chi tiết đơn hàng */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full mx-4 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-[#3d1f00]">
                Chi Tiết Đơn Hàng #{selectedOrder._id.substring(selectedOrder._id.length - 8)}
              </h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Thông Tin Khách Hàng</h3>
                <p>
                  <span className="font-medium">Tên:</span>{" "}
                  {selectedOrder.user ? selectedOrder.user.name : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Email:</span>{" "}
                  {selectedOrder.user ? selectedOrder.user.email : "N/A"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">Thông Tin Đơn Hàng</h3>
                <p>
                  <span className="font-medium">Ngày đặt:</span>{" "}
                  {formatDate(selectedOrder.createdAt)}
                </p>
                <p>
                  <span className="font-medium">Trạng thái:</span>{" "}
                  <span className={`px-2 py-1 rounded-full ${getStatusColor(selectedOrder.orderStatus)}`}>
                    {getStatusText(selectedOrder.orderStatus)}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Thanh toán:</span>{" "}
                  <span className={`px-2 py-1 rounded-full ${
                    selectedOrder.orderStatus === 'shipped' || selectedOrder.isPaid 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'}`}
                  >
                    {selectedOrder.orderStatus === 'shipped' || selectedOrder.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </span>
                </p>
                {(selectedOrder.orderStatus === 'shipped' || selectedOrder.isPaid) && selectedOrder.paidAt && (
                  <p>
                    <span className="font-medium">Ngày thanh toán:</span>{" "}
                    {formatDate(selectedOrder.paidAt)}
                  </p>
                )}
                {selectedOrder.orderStatus === 'shipped' && (
                  <p>
                    <span className="font-medium">Ngày giao hàng:</span>{" "}
                    {formatDate(selectedOrder.deliveredAt || selectedOrder.updatedAt)}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Địa Chỉ Giao Hàng</h3>
              <p>
                {selectedOrder.shippingAddress?.fullName}, {selectedOrder.shippingAddress?.phone}
              </p>
              <p>
                {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.ward}, {selectedOrder.shippingAddress?.district}, {selectedOrder.shippingAddress?.city}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-2">Sản Phẩm</h3>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="p-3 text-left">Sản phẩm</th>
                      <th className="p-3 text-right">Giá</th>
                      <th className="p-3 text-right">Số lượng</th>
                      <th className="p-3 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items && selectedOrder.items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-right">{formatCurrency(item.price)}đ</td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">{formatCurrency(item.price * item.quantity)}đ</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td colSpan="3" className="p-3 text-right">
                        Tổng tiền:
                      </td>
                      <td className="p-3 text-right">{formatCurrency(selectedOrder.totalAmount)}đ</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center mt-6">
              <div>
                <label className="font-medium mr-2">Cập nhật trạng thái:</label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                  className={`p-2 rounded-md ${getStatusColor(selectedOrder.orderStatus)}`}
                >
                  <option value="pending">Chờ xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="shipping">Đang giao</option>
                  <option value="shipped">Đã giao</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;