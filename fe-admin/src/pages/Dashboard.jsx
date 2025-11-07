import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, // Thêm import Filler plugin
} from "chart.js";
import api from "../services/api";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

// Đăng ký plugin Filler
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler // Thêm đăng ký Filler plugin
);

const Dashboard = () => {
  // State variables
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Thống kê tổng quan
  const [dashboardStats, setDashboardStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0
  });
  
  // Biểu đồ doanh thu
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  
  // Đơn hàng gần đây
  const [recentOrders, setRecentOrders] = useState([]);
  
  // Sản phẩm bán chạy
  const [topProducts, setTopProducts] = useState([]);

  // Load dữ liệu khi component được render
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Fetch tất cả dữ liệu dashboard từ API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Lấy thống kê từ trang orders để có doanh thu chính xác
      const orderAnalyticsResponse = await api.get('/orders/analytics');
      const orderRevenue = orderAnalyticsResponse.data?.totalRevenue || 0;
      
      // 2. Lấy thống kê tổng quan
      const statsResponse = await api.get('/dashboard/stats');
      
      // Cập nhật thống kê với doanh thu chính xác từ API orders/analytics
      setDashboardStats({
        ...statsResponse.data,
        totalRevenue: orderRevenue // Sử dụng doanh thu từ API orders/analytics
      });
      
      console.log("Dashboard - Doanh thu từ dashboard/stats:", statsResponse.data.totalRevenue);
      console.log("Dashboard - Doanh thu từ orders/analytics (sử dụng):", orderRevenue);
      
      // 3. Lấy doanh thu theo tháng
      const revenueResponse = await api.get('/dashboard/monthly-revenue');
      setMonthlyRevenue(revenueResponse.data);
      
      // 4. Lấy đơn hàng gần đây
      const ordersResponse = await api.get('/orders/recent');
      setRecentOrders(ordersResponse.data);
      
      // 5. Lấy sản phẩm bán chạy
      try {
        const productsResponse = await api.get('/products/top');
        setTopProducts(productsResponse.data);
      } catch (productError) {
        console.error("Error fetching top products:", productError);
        setTopProducts([]);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu dashboard:", error);
      
      // Xử lý trường hợp API orders/analytics thất bại
      try {
        // Vẫn lấy thống kê cơ bản nếu có thể
        const statsResponse = await api.get('/dashboard/stats');
        setDashboardStats(statsResponse.data);
        
        // Lấy dữ liệu khác nếu có thể
        const revenueResponse = await api.get('/dashboard/monthly-revenue');
        setMonthlyRevenue(revenueResponse.data);
        
        const ordersResponse = await api.get('/orders/recent');
        setRecentOrders(ordersResponse.data);
        
      } catch (fallbackError) {
        console.error("Lỗi khi tải dữ liệu dự phòng:", fallbackError);
      }
      
      setError("Không thể tải đầy đủ dữ liệu. Một số thông tin có thể không chính xác.");
      setLoading(false);
    }
  };

  // Thay thế hàm formatCurrency hiện tại
  const formatCurrency = (value) => {
    if (!value) return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  
  // Format ngày tháng
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return "Ngày không hợp lệ";
    }
  };

  // Tạo dữ liệu cho biểu đồ doanh thu
  const revenueChartData = {
    labels: monthlyRevenue.map(item => `Tháng ${item.month}`),
    datasets: [
      {
        label: "Doanh Thu",
        data: monthlyRevenue.map(item => item.revenue / 1000000), // Chuyển đổi thành triệu đồng
        borderColor: "#3d1f00",
        backgroundColor: "rgba(61, 31, 0, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };
  
  const revenueChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Doanh thu: ${formatCurrency(context.parsed.y * 1000000)}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Triệu đồng'
        }
      }
    }
  };

  // Loading indicator
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#3d1f00] border-t-transparent"></div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-6">
          <p>{error}</p>
          <button 
            onClick={fetchDashboardData} 
            className="mt-2 bg-red-800 text-white px-4 py-1 rounded-md hover:bg-red-900"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Tiêu đề */}
      <h1 className="text-3xl font-bold text-[#3d1f00] mb-6">Bảng Điều Khiển</h1>

      {/* Thẻ thống kê */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        {/* Tổng Sản Phẩm */}
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Tổng Sản Phẩm</h2>
              <p className="text-3xl font-bold text-blue-600">{dashboardStats.totalProducts}</p>
              <p className="text-sm text-green-500">↑ 8% so với tháng trước</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full flex items-center justify-center w-14 h-14">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Tổng Doanh Thu */}
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Tổng Doanh Thu</h2>
              <p className="text-3xl font-bold text-purple-600">{formatCurrency(dashboardStats.totalRevenue)}đ</p>
              <p className="text-sm text-green-500">↑ 12% so với tháng trước</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full flex items-center justify-center w-14 h-14">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Tổng Khách Hàng */}
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-indigo-500">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Tổng Khách Hàng</h2>
              <p className="text-3xl font-bold text-indigo-600">{dashboardStats.totalUsers}</p>
              <p className="text-sm text-green-500">↑ 15% so với tháng trước</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full flex items-center justify-center w-14 h-14">
              <svg className="w-8 h-8 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Tổng Đơn Hàng */}
        <div className="bg-white shadow-md rounded-lg p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-gray-700">Tổng Đơn Hàng</h2>
              <p className="text-3xl font-bold text-green-600">{dashboardStats.totalOrders}</p>
              <p className="text-sm text-green-500">↑ 10% so với tháng trước</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full flex items-center justify-center w-14 h-14">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Biểu đồ và danh sách đơn hàng gần đây */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Biểu đồ doanh thu */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-[#3d1f00] mb-4">Doanh Thu Theo Tháng</h2>
          {monthlyRevenue.length > 0 ? (
            <Line data={revenueChartData} options={revenueChartOptions} />
          ) : (
            <div className="border border-gray-200 rounded-md p-8 text-center">
              <p className="text-gray-500">Không có dữ liệu doanh thu</p>
            </div>
          )}
        </div>
        
        {/* Đơn hàng gần đây */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#3d1f00]">Đơn Hàng Gần Đây</h2>
            <Link to="/orders" className="text-blue-600 hover:text-blue-800 text-sm">
              Xem tất cả
            </Link>
          </div>
          <div className="overflow-y-auto max-h-[350px]">
            {recentOrders.length > 0 ? (
              <ul className="space-y-4">
                {recentOrders.map((order) => (
                  <li key={order._id} className="border-b pb-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-bold text-[#3d1f00]">{order.user?.name || "Khách hàng"}</p>
                        <p className="text-sm text-gray-600">{order.user?.email || "N/A"}</p>
                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                      </div>
                      <p className="font-bold text-[#3d1f00]">{formatCurrency(order.totalAmount)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="border border-gray-200 rounded-md p-8 text-center">
                <p className="text-gray-500">Không có đơn hàng nào gần đây</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sản phẩm bán chạy */}
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-[#3d1f00]">Sản Phẩm Bán Chạy</h2>
          <Link to="/products" className="text-blue-600 hover:text-blue-800 text-sm">
            Tất cả sản phẩm
          </Link>
        </div>
        <div className="overflow-x-auto">
          {topProducts.length > 0 ? (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fdf8f0] border-b">
                  <th className="p-4">Sản Phẩm</th>
                  <th className="p-4">Mô Tả</th>
                  <th className="p-4 text-right">Giá</th>
                  <th className="p-4 text-center">Tồn Kho</th>
                  <th className="p-4 text-center">Đánh Giá</th>
                  <th className="p-4 text-center">Đã Bán</th>
                  <th className="p-4 text-center">Hành Động</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-[#3d1f00]">{product.name || "Sản phẩm không tên"}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {product.description ? 
                        (product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description) 
                        : "Không có mô tả"}
                    </td>
                    <td className="p-4 text-right font-medium">{formatCurrency(product.price)}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        (product.stockCount || product.stock) > 20 
                          ? 'bg-green-100 text-green-800' 
                          : (product.stockCount || product.stock) > 10 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.stockCount || product.stock || 0}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <div className="text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < Math.floor(product.rating) ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <div className="text-xs text-gray-600">
                        {product.rating} ({product.reviewCount || 0} đánh giá)
                      </div>
                    </td>
                    <td className="p-4 text-center font-medium text-green-600">
                      {product.totalSold || 0}
                    </td>
                    <td className="p-4 text-center">
                      <Link to={`/products/${product._id}`} className="text-blue-600 hover:text-blue-800 mx-1" title="Xem chi tiết">
                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </Link>
                      <Link to={`/products/edit/${product._id}`} className="text-green-600 hover:text-green-800 mx-1" title="Chỉnh sửa">
                        <svg className="w-5 h-5 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                        </svg>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="border border-gray-200 rounded-md p-8 text-center">
              <p className="text-gray-500">Không tìm thấy sản phẩm nào</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;