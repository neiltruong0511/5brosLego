const jwt = require('jsonwebtoken');
const User = require('../models/UserModels');

// Bảo vệ routes - Kiểm tra đăng nhập
exports.protect = async (req, res, next) => {
    let token;

    // Kiểm tra token từ headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Lấy token từ header
            token = req.headers.authorization.split(' ')[1];

            // Giải mã token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Tìm user theo id từ token và không trả về mật khẩu
            req.user = await User.findById(decoded.id).select('-password');

            if (!req.user) {
                res.status(401);
                throw new Error('Không tìm thấy người dùng');
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Không được phép truy cập, token không hợp lệ' });
        }
    }

    if (!token) {
        res.status(401).json({ message: 'Không được phép truy cập, không có token' });
    }
};

// Kiểm tra quyền admin
exports.admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Không được phép truy cập, chỉ admin mới có quyền' });
    }
};
