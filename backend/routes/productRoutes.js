const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/', productController.getProducts); // lay danh sach san pham
router.get('/featured', productController.getFeaturedProducts); // lay danh sach san pham noi bat
router.get('/:id', productController.getProductById);
router.get('/search', productController.searchProducts); // tim kiem san pham
router.get('/category', productController.getProductsByCategory); // lay san pham theo danh muc

// Admin routes
router.post('/', protect, admin, productController.createProduct); // tao san pham
router.put('/:id', protect, admin, productController.updateProduct); // cap nhat san pham
router.delete('/:id', protect, admin, productController.deleteProduct); // xoa san pham

module.exports = router;
