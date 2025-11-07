const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

// Tất cả routes đều yêu cầu đăng nhập
router.use(protect);

// Lấy giỏ hàng
router.get('/', cartController.getCart);

// Thêm sản phẩm vào giỏ hàng
router.post('/add', cartController.addToCart);

// Cập nhật số lượng sản phẩm
router.put('/update', cartController.updateCartItem);

// Xóa sản phẩm khỏi giỏ hàng
router.delete('/remove/:productId', cartController.removeFromCart);

// Xóa tất cả sản phẩm trong giỏ hàng
router.delete('/remove/:productId', cartController.removeFromCart);

module.exports = router;