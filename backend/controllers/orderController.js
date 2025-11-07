const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

exports.createOrder = async (req, res) => {
    try {
        const { shippingAddress } = req.body;

        // Tìm giỏ hàng
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Giỏ hàng trống' });
        }

        // Kiểm tra số lượng tồn kho
        for (const item of cart.items) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    message: `Không tìm thấy sản phẩm với ID: ${item.product}`
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Sản phẩm ${product.name} chỉ còn ${product.stock} sản phẩm`
                });
            }
        }

        // Tạo danh sách sản phẩm cho đơn hàng
        const orderItems = await Promise.all(cart.items.map(async (item) => {
            const product = await Product.findById(item.product);

            // Cập nhật số lượng tồn kho
            product.stock -= item.quantity;
            await product.save();

            return {
                product: item.product,
                name: product.name,
                quantity: item.quantity,
                price: item.price
            };
        }));

        // Tính tổng tiền
        const totalAmount = cart.items.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);

        // Tạo đơn hàng mới
        const order = new Order({
            user: req.user._id,
            items: orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod: 'cod',
            orderStatus: 'pending'
        });

        const createdOrder = await order.save();

        // Xóa giỏ hàng sau khi đặt hàng
        cart.items = [];
        await cart.save();

        res.status(201).json(createdOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết đơn hàng
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        // Kiểm tra đơn hàng tồn tại
        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Kiểm tra quyền truy cập (chỉ admin hoặc chủ đơn hàng)
        if (req.user.role !== 'admin' && order.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Không được phép truy cập' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy tất cả đơn hàng của người dùng
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort('-createdAt');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Lấy tất cả đơn hàng
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'id name')
            .sort('-createdAt');

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, isPaid } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Cập nhật trạng thái đơn hàng
        if (orderStatus) {
            order.orderStatus = orderStatus;
        }

        // Cập nhật trạng thái thanh toán
        if (isPaid !== undefined) {
            order.isPaid = isPaid;
            if (isPaid) {
                order.paidAt = Date.now();
            } else {
                order.paidAt = null;
            }
        }

        const updatedOrder = await order.save();

        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hủy đơn hàng (người dùng chỉ được hủy đơn hàng ở trạng thái pending)
exports.cancelOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
        }

        // Kiểm tra quyền truy cập
        if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: 'Không được phép thực hiện' });
        }

        // Kiểm tra trạng thái đơn hàng
        if (order.orderStatus !== 'pending' && req.user.role !== 'admin') {
            return res.status(400).json({
                message: 'Chỉ có thể hủy đơn hàng ở trạng thái chờ xử lý'
            });
        }

        // Cập nhật trạng thái đơn hàng
        order.orderStatus = 'cancelled';

        // Hoàn trả số lượng sản phẩm về kho
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        await order.save();

        res.json({ message: 'Đã hủy đơn hàng' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
