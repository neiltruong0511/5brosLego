const Review = require('../models/ReviewModels');
const Product = require('../models/Product');
const Order = require('../models/OrderModels');

// Tạo đánh giá mới
exports.createReview = async (req, res) => {
  try {
    const { orderId, productId, rating, comment } = req.body;
    const userId = req.user._id;

    // Kiểm tra đánh giá đã tồn tại
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
      order: orderId
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'Bạn đã đánh giá sản phẩm này rồi' 
      });
    }

    // Tạo đánh giá mới
    const review = await Review.create({
      user: userId,
      product: productId,
      order: orderId,
      rating,
      comment
    });

    res.status(201).json({
      message: 'Đánh giá thành công',
      review
    });
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ 
      message: 'Không thể tạo đánh giá, vui lòng thử lại' 
    });
  }
};

// Lấy tất cả đánh giá của một sản phẩm
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name');

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Xóa đánh giá
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ message: 'Không tìm thấy đánh giá' });
    }

    // Chỉ cho phép người dùng xóa đánh giá của họ hoặc admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ message: 'Không được phép thực hiện' });
    }

    await review.remove();
    res.json({ message: 'Đã xóa đánh giá' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOrderForReview = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      user: req.user._id
    }).populate('items.product');

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Get existing reviews for this order
    const existingReviews = await Review.find({ 
      order: order._id,
      user: req.user._id
    });

    // Filter items that haven't been reviewed
    const reviewedProductIds = existingReviews.map(review => 
      review.product.toString()
    );

    const unreviewedItems = order.items.filter(item => 
      !reviewedProductIds.includes(item.product._id.toString())
    );

    res.json({
      order,
      unreviewedItems
    });
  } catch (error) {
    console.error('Error in getOrderForReview:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};

exports.createOrderReview = async (req, res) => {
  try {
    const { orderId, productId, rating, comment } = req.body;

    // Validate order belongs to user
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id
    });

    if (!order) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    // Check if product exists in order
    const orderItem = order.items.find(item => 
      item.product.toString() === productId
    );

    if (!orderItem) {
      return res.status(400).json({ 
        message: 'Sản phẩm không tồn tại trong đơn hàng này' 
      });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({
      order: orderId,
      product: productId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ 
        message: 'Bạn đã đánh giá sản phẩm này trong đơn hàng' 
      });
    }

    // Create review
    const review = new Review({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating,
      comment
    });

    await review.save();

    res.status(201).json({
      message: 'Đánh giá thành công',
      review
    });
  } catch (error) {
    console.error('Error in createOrderReview:', error);
    res.status(500).json({ message: 'Lỗi server' });
  }
};
