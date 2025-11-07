const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes (đăng nhập mới truy cập được)
router.get('/profile', protect, userController.getUserProfile); 
router.put('/profile', protect, userController.updateUserProfile); 

// Admin routes
router.get('/', protect, admin, userController.getUsers); // Lấy danh sách người dùng
router.delete('/:id', protect, admin, userController.deleteUser); // Xóa người dùng
router.put('/:id', protect, admin, userController.updateUser); // Cập nhật người dùng

module.exports = router;
