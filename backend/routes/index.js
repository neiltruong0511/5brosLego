const express = require('express');
const router = express.Router();

const userRoutes = require('./userRoutes');
const productRoutes = require('./productRoutes');
const reviewRoutes = require('./reviewRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');

router.use('/api/users', userRoutes);
router.use('/api/products', productRoutes);
router.use('/api/reviews', reviewRoutes);
router.use('/api/cart', cartRoutes);
router.use('/api/orders', orderRoutes);

module.exports = router;
