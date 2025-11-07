const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    // ten san pham
    name: {
        type: String,
        required: true
    },
    // mo ta san pham
    description: {
        type: String,
        required: true
    },
    // gia san pham
    price: {
        type: Number,
        required: true,
        min: 0
    },

    // hinh anh san pham
    imageUrl: {
        type: [String],
        required: true
    },

    // Thêm trường images để lưu dữ liệu nhị phân
    images: [{
        data: Buffer,
        contentType: String,
        name: String
    }],

    // danh muc san pham
    category: {
        type: String,
        required: true
    },

    // so luong ton kho
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },

    // san pham noi bat 
    isFeatured: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Cập nhật thời gian khi sửa sản phẩm
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Tạo model
const Product = mongoose.model('Product', productSchema);
module.exports = Product;
