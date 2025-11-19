import mongoose from 'mongoose'; // 👈 Sửa dòng này: dùng import thay vì require

const productSchema = new mongoose.Schema({
    // Tên sản phẩm
    name: {
        type: String,
        required: true
    },
    // Mô tả sản phẩm
    description: {
        type: String,
        required: true
    },
    // Giá sản phẩm
    price: {
        type: Number,
        required: true,
        min: 0
    },
    // Hình ảnh sản phẩm (Link ảnh)
    imageUrl: {
        type: [String],
        required: true
    },
    // Dữ liệu ảnh nhị phân (nếu dùng)
    images: [{
        data: Buffer,
        contentType: String,
        name: String
    }],
    // Danh mục sản phẩm
    category: {
        type: String,
        required: true
    },
    // Số lượng tồn kho
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    // Sản phẩm nổi bật 
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

export default Product; // 👈 Sửa dòng này: dùng export default thay vì module.exports