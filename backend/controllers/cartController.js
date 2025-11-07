const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Lấy giỏ hàng của người dùng
exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id })
            .populate('items.product');

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
            await cart.save();
        }

        // Đảm bảo trả về đầy đủ thông tin sản phẩm
        const cartWithDetails = {
            ...cart._doc,
            items: cart.items.map(item => ({
                product: {
                    _id: item.product._id,
                    name: item.product.name,
                    imageUrl: item.product.imageUrl,
                },
                quantity: item.quantity,
                price: item.price
            }))
        };

        res.json(cartWithDetails);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Thêm sản phẩm vào giỏ hàng
exports.addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Kiểm tra sản phẩm tồn tại
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Kiểm tra số lượng hàng tồn kho
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Sản phẩm không đủ số lượng' });
        }

        // Tìm hoặc tạo giỏ hàng
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex > -1) {
            // Sản phẩm đã có trong giỏ hàng
            cart.items[itemIndex].quantity += quantity;
        } else {
            // Thêm sản phẩm mới vào giỏ hàng
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }

        await cart.save();

        // Populate thông tin sản phẩm
        await cart.populate('items.product');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật số lượng sản phẩm trong giỏ hàng
exports.updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Kiểm tra số lượng hợp lệ
        if (quantity < 1) {
            return res.status(400).json({ message: 'Số lượng phải lớn hơn 0' });
        }

        // Kiểm tra sản phẩm tồn tại
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        // Kiểm tra số lượng hàng tồn kho
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Sản phẩm không đủ số lượng' });
        }

        // Tìm giỏ hàng
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        // Tìm vị trí sản phẩm trong giỏ hàng
        const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

        if (itemIndex === -1) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong giỏ hàng' });
        }

        // Cập nhật số lượng
        cart.items[itemIndex].quantity = quantity;

        await cart.save();

        // Populate thông tin sản phẩm
        await cart.populate('items.product');

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Xóa sản phẩm khỏi giỏ hàng
exports.removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        console.log('Removing product:', productId); // Thêm log để debug

        // Tìm giỏ hàng của user
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        // Lọc bỏ sản phẩm cần xóa
        cart.items = cart.items.filter(item => item.product.toString() !== productId);

        await cart.save();
        
        // Populate thông tin sản phẩm trước khi trả về
        await cart.populate('items.product');

        res.json(cart);
    } catch (error) {
        console.error('Error removing item:', error);
        res.status(500).json({ message: error.message });
    }
};

// Xóa tất cả sản phẩm trong giỏ hàng
exports.clearCart = async (req, res) => {
    try {
        // Tìm giỏ hàng
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng' });
        }

        // Xóa tất cả sản phẩm
        cart.items = [];

        await cart.save();

        res.json({ message: 'Đã xóa tất cả sản phẩm trong giỏ hàng' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
