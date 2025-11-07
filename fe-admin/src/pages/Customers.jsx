import React, { useState, useEffect } from "react";
import api from "../services/api";
import { format, isThisMonth } from "date-fns"; // Thêm isThisMonth
import { vi } from "date-fns/locale";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "user",
  });
  const [editCustomer, setEditCustomer] = useState(null);

  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "",
  });

  const [deleteConfirm, setDeleteConfirm] = useState({
    show: false,
    id: null,
    name: "",
  });

  const currentDate = format(new Date(), "dd/MM/yyyy");
  const currentTime = format(new Date(), "HH:mm:ss");

  const [stats, setStats] = useState({
    totalUsers: 0,
    newUsersThisMonth: 0,
    totalAdmins: 0,
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
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/users");
      const sortedCustomers = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setCustomers(sortedCustomers);

      calculateUserStats(sortedCustomers);

      setLoading(false);
    } catch (error) {
      setError("Không thể tải danh sách người dùng");
      setLoading(false);

      setStats({
        totalUsers: 458,
        newUsersThisMonth: 42,
        totalAdmins: 5,
      });
    }
  };

  const calculateUserStats = (users) => {
    if (!users || users.length === 0) return;

    const totalUsers = users.length;

    const totalAdmins = users.filter((user) => user.role === "admin").length;

    const newUsersThisMonth = users.filter((user) => {
      const createdAt = new Date(user.createdAt);
      return isThisMonth(createdAt);
    }).length;

    setStats({
      totalUsers,
      newUsersThisMonth,
      totalAdmins,
    });
  };

  // Format date to HH:mm:ss
  const formatDateTime = (timestamp) => {
    if (!timestamp) return "N/A";
    try {
      return format(new Date(timestamp), "HH:mm:ss", { locale: vi });
    } catch (error) {
      return "Không hợp lệ";
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

  const handleAddCustomer = async () => {
    try {
      if (
        !newCustomer.name ||
        !newCustomer.email ||
        !newCustomer.password ||
        !newCustomer.phone
      ) {
        showNotification("Vui lòng điền đầy đủ thông tin!", "warning");
        return;
      }

      const response = await api.post("/users/register", newCustomer);
      const newCustomerWithTimestamp = {
        ...response.data,
        createdAt: new Date().toISOString(),
      };
      setCustomers([newCustomerWithTimestamp, ...customers]);
      setNewCustomer({
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "user",
      });
      setShowAddForm(false);
      showNotification("Thêm người dùng thành công!", "success");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Không thể thêm người dùng",
        "error"
      );
    }
  };

  const handleSaveEditCustomer = async () => {
    try {
      if (!editCustomer.name || !editCustomer.email || !editCustomer.phone) {
        showNotification("Vui lòng điền đầy đủ thông tin!", "warning");
        return;
      }

      const response = await api.put(
        `/users/${editCustomer._id}`,
        editCustomer
      );
      setCustomers(
        customers.map((customer) =>
          customer._id === editCustomer._id
            ? { ...response.data, createdAt: customer.createdAt }
            : customer
        )
      );
      setEditCustomer(null);
      showNotification("Cập nhật người dùng thành công!", "success");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Không thể cập nhật người dùng",
        "error"
      );
    }
  };

  const confirmDeleteCustomer = (id, name) => {
    setDeleteConfirm({
      show: true,
      id,
      name,
    });
  };

  const handleDeleteCustomer = async () => {
    try {
      await api.delete(`/users/${deleteConfirm.id}`);
      setCustomers(
        customers.filter((customer) => customer._id !== deleteConfirm.id)
      );
      showNotification("Xóa người dùng thành công!", "success");
      setDeleteConfirm({ show: false, id: null, name: "" });
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Không thể xóa người dùng",
        "error"
      );
    }
  };

  const cancelDelete = () => {
    setDeleteConfirm({ show: false, id: null, name: "" });
  };

  const handleRoleChange = async (id, newRole) => {
    try {
      const response = await api.put(`/users/${id}`, { role: newRole });
      setCustomers(
        customers.map((customer) =>
          customer._id === id
            ? { ...response.data, createdAt: customer.createdAt }
            : customer
        )
      );
      showNotification("Cập nhật vai trò thành công!", "success");
    } catch (error) {
      showNotification(
        error.response?.data?.message || "Không thể cập nhật vai trò",
        "error"
      );
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          onClick={fetchCustomers}
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

      {deleteConfirm.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <div className="text-center">
              <svg
                className="mx-auto mb-4 w-14 h-14 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Xác nhận xóa người dùng
              </h3>
              <p className="text-gray-500 mb-6">
                Bạn có chắc chắn muốn xóa người dùng{" "}
                <span className="font-semibold">{deleteConfirm.name}</span>? Hành
                động này không thể hoàn tác.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleDeleteCustomer}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản Lý Người Dùng</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#3d1f00] text-white px-4 py-2 rounded-md hover:bg-[#7a4b27] transition"
        >
          {showAddForm ? "Hủy" : "Thêm Người Dùng"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-medium">Tổng Người Dùng</p>
              <h2 className="text-2xl font-bold text-indigo-600">
                {stats.totalUsers}
              </h2>
              <p className="text-sm text-green-500 mt-1">↑ 8%</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-indigo-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-medium">Đăng Ký Tháng Này</p>
              <h2 className="text-2xl font-bold text-pink-600">
                {stats.newUsersThisMonth}
              </h2>
              <p className="text-sm text-green-500 mt-1">↑ 12%</p>
            </div>
            <div className="bg-pink-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-pink-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                ></path>
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-700 font-medium">Tổng Admin</p>
              <h2 className="text-2xl font-bold text-red-600">
                {stats.totalAdmins}
              </h2>
              <p className="text-sm text-yellow-500 mt-1">• Không thay đổi</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                ></path>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-[#fdf8f0] shadow-md rounded-lg p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">
            Thêm Người Dùng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Họ và Tên"
              value={newCustomer.name}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, name: e.target.value })
              }
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              placeholder="Email"
              value={newCustomer.email}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, email: e.target.value })
              }
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              placeholder="Mật Khẩu"
              value={newCustomer.password}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, password: e.target.value })
              }
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Số Điện Thoại"
              value={newCustomer.phone}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, phone: e.target.value })
              }
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={newCustomer.role}
              onChange={(e) =>
                setNewCustomer({ ...newCustomer, role: e.target.value })
              }
              className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="p-2 border rounded-md bg-gray-100 text-gray-700">
              Ngày tạo: {currentDate}
            </div>
          </div>
          <button
            onClick={handleAddCustomer}
            className="mt-4 bg-[#3d1f00] text-white px-4 py-2 rounded-md hover:bg-[#7a4b27] transition"
          >
            Lưu
          </button>
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="overflow-x-auto bg-[#fdf8f0] shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#3d1f00] text-white">
              <th className="p-4">STT</th>
              <th className="p-4">Họ và Tên</th>
              <th className="p-4">Email</th>
              <th className="p-4">Số Điện Thoại</th>
              <th className="p-4">Vai Trò</th>
              <th className="p-4">Thời Gian Tạo</th>
              <th className="p-4">Ngày Tạo</th>
              <th className="p-4">Hành Động</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.length > 0 ? (
              filteredCustomers.map((customer, index) => (
                <tr key={customer._id} className="border-b hover:bg-gray-100">
                  <td className="p-4">{index + 1}</td>
                  <td className="p-4">{customer.name}</td>
                  <td className="p-4">{customer.email}</td>
                  <td className="p-4">{customer.phone}</td>
                  <td className="p-4">
                    <select
                      value={customer.role}
                      onChange={(e) =>
                        handleRoleChange(customer._id, e.target.value)
                      }
                      className={`p-2 border rounded-md focus:outline-none focus:ring-2 ${
                        customer.role === "admin"
                          ? "bg-yellow-100 text-red-600 font-bold"
                          : "bg-white text-gray-800"
                      }`}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-4">{formatDateTime(customer.createdAt)}</td>
                  <td className="p-4">{formatDate(customer.createdAt)}</td>
                  <td className="p-4">
                    <button
                      onClick={() => setEditCustomer(customer)}
                      className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 transition mr-2"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() =>
                        confirmDeleteCustomer(customer._id, customer.name)
                      }
                      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                    >
                      Xóa
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-4 text-center text-gray-500">
                  Không tìm thấy người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editCustomer && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Chỉnh sửa người dùng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Họ và Tên"
                value={editCustomer.name}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, name: e.target.value })
                }
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={editCustomer.email}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, email: e.target.value })
                }
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Số Điện Thoại"
                value={editCustomer.phone}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, phone: e.target.value })
                }
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={editCustomer.role}
                onChange={(e) =>
                  setEditCustomer({ ...editCustomer, role: e.target.value })
                }
                className="p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex justify-end mt-6 gap-4">
              <button
                onClick={() => setEditCustomer(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleSaveEditCustomer}
                className="bg-[#3d1f00] text-white px-4 py-2 rounded-md hover:bg-[#7a4b27] transition"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Customers;