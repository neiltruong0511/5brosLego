const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');
const Order = require('../models/Order'); // Assuming Order model is required

// Tất cả routes đều yêu cầu đăng nhập
router.use(protect);

// Tạo đơn hàng mới
router.post('/', orderController.createOrder);

// Lấy đơn hàng của người dùng
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort('-createdAt');
    
    console.log('Sending orders:', orders); // Debug log
    res.json(orders);
  } catch (error) {
    console.error('Error getting orders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Lấy chi tiết đơn hàng
router.get('/:id', orderController.getOrderById);

// Hủy đơn hàng
router.put('/cancel/:id', orderController.cancelOrder);

// Admin routes
router.get('/', admin, orderController.getAllOrders);
router.put('/:id/status', admin, orderController.updateOrderStatus);

module.exports = router;
