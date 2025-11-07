const Product = require('../models/Product');

// Lấy tất cả sản phẩm với phân trang
exports.getProducts = async (req, res) => {
    try {
        const pageSize = 10;
        const page = Number(req.query.page) || 1;

        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i'
                }
            }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};

        const count = await Product.countDocuments({ ...keyword, ...category });

        const products = await Product.find({ ...keyword, ...category })
            .limit(pageSize)
            .skip(pageSize * (page - 1));

        res.json({
            products,
            page,
            pages: Math.ceil(count / pageSize),
            totalProducts: count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy sản phẩm nổi bật
exports.getFeaturedProducts = async (req, res) => {
    try {
        const featuredProducts = await Product.find({ isFeatured: true }).limit(8);
        res.json(featuredProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Lấy chi tiết một sản phẩm
exports.getProductById = async (req, res) => {
    try {
        console.log("ID sản phẩm:", req.params.id); // Log ID sản phẩm
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
        res.status(500).json({ message: error.message });
    }
};
// search sản phẩm theo tên
exports.searchProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i'
                }
            }
            : {};

        const products = await Product.find({ ...keyword });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Lấy sản phẩm theo danh mục
exports.getProductsByCategory = async (req, res) => {
    try {
        const category = req.query.category ? { category: req.query.category } : {};

        const products = await Product.find({ ...category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Tạo sản phẩm mới
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, category, stock, isFeatured } = req.body;

        const product = new Product({
            name,
            description,
            price,
            imageUrl,
            category,
            stock,
            isFeatured: isFeatured || false
        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Cập nhật sản phẩm
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, price, imageUrl, category, stock, isFeatured } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            product.name = name || product.name;
            product.description = description || product.description;
            product.price = price || product.price;
            product.imageUrl = imageUrl || product.imageUrl;
            product.category = category || product.category;
            product.stock = stock !== undefined ? stock : product.stock;
            product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;

            const updatedProduct = await product.save();
            res.json(updatedProduct);
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin: Xóa sản phẩm
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            await product.remove();
            res.json({ message: 'Đã xóa sản phẩm' });
        } else {
            res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};