const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const reviewController = require('../controllers/reviewController');

// Routes
router.post('/create', protect, reviewController.createReview);
router.get('/product/:productId', reviewController.getProductReviews);
router.get('/order/:orderId', protect, reviewController.getOrderForReview);
router.delete('/:id', protect, reviewController.deleteReview);

module.exports = router;
