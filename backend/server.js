// ======================= server.js HOÀN CHỈNH =======================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const apiRoutes = require("./api"); // Import các routes khác
const OpenAI = require("openai"); 
const Product = require("./models/ProductModels"); // ✅ Import Model Sản Phẩm để chatbot tìm kiếm

// Load biến môi trường
dotenv.config();

const app = express();

// ==================== 1. Middleware ====================
app.use(
  cors({
    // Cho phép Frontend (Localhost) và Web thật (5broslego.click) truy cập
    origin: [
        "http://localhost:5173", 
        "http://localhost:3000", 
        "https://5broslego.click", 
        "https://www.5broslego.click"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Cấu hình thư mục ảnh tĩnh (Để hiển thị ảnh upload)
const __dirname_fixed = path.resolve();
app.use("/uploads", express.static(path.join(__dirname_fixed, "uploads")));

// Mount các API chính (User, Order,...)
app.use("/api", apiRoutes);

// ==================== 2. CHATBOT AI THÔNG MINH (Logic Full) ====================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Đảm bảo file .env có key này
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "Thiếu tin nhắn." });

    const userMsg = message.toLowerCase();
    let foundProducts = [];
    let isShowAll = false;

    // --- BƯỚC A: TÌM KIẾM SẢN PHẨM TỪ MONGODB ---
    
    // 1. Khách muốn xem "Tất cả" hoặc "Mới nhất"
    if (userMsg.match(/(tất cả|all|danh sách|mới nhất|show|xem hàng|sản phẩm)/) && !userMsg.match(/(tìm|giá|lego)/)) {
      foundProducts = await Product.find().sort({ createdAt: -1 }).limit(6).lean();
      isShowAll = true;
    } 
    // 2. Khách tìm cụ thể (Ví dụ: "Lego Technic", "Xe đua")
    else {
      const categories = ["Architecture", "City", "Friends", "Technic", "Ninjago", "DC Super Heroes", "Star Wars", "Harry Potter"];
      const detectedCategory = categories.find(cat => userMsg.includes(cat.toLowerCase()));
      
      let query = {};
      if (detectedCategory) {
        // Tìm theo danh mục nếu phát hiện từ khóa danh mục
        query = { category: { $regex: detectedCategory, $options: "i" } };
      } else {
        // Tìm theo tên hoặc mô tả
        query = {
          $or: [
            { name: { $regex: message, $options: "i" } },
            { description: { $regex: message, $options: "i" } }
          ]
        };
      }

      // Chỉ tìm nếu khách có ý định mua/xem
      const isShoppingIntent = /(lego|giá|mua|tìm|có mẫu|bộ|set|bi nhiêu|tư vấn|shop|xe|nhà|rồng)/.test(userMsg);
      
      if (isShoppingIntent || detectedCategory) {
        foundProducts = await Product.find(query).limit(5).lean();
      }
    }

    // --- BƯỚC B: HÀM XỬ LÝ ẢNH (Quan trọng để hiển thị trên Chatbox) ---
    const processProducts = (products) => {
        // 👇 ĐÂY LÀ LINK SERVER CỦA BẠN (Dùng để nối vào đường dẫn ảnh)
        const BACKEND_URL = "https://fivebroslego.onrender.com"; 

        return products.map(p => {
            let finalImage = "https://via.placeholder.com/150"; // Ảnh mặc định

            if (p.imageUrl && p.imageUrl.length > 0) {
                let imgPath = p.imageUrl[0];
                
                // Nếu là link online (http...) -> Giữ nguyên
                if (imgPath.startsWith("http")) {
                    finalImage = imgPath;
                } 
                // Nếu là đường dẫn file nội bộ -> Nối thêm domain server vào
                else {
                     // Xử lý dấu gạch chéo
                     const cleanPath = imgPath.startsWith("/") ? imgPath : `/${imgPath}`;
                     // Nếu đường dẫn chưa có chữ uploads (tuỳ cách bạn lưu), có thể cần thêm vào
                     // Ở đây giả định bạn lưu đường dẫn đầy đủ kiểu "/uploads/abc.jpg"
                     finalImage = `${BACKEND_URL}${cleanPath}`;
                }
            }

            return {
                _id: p._id,
                name: p.name,
                price: p.price,
                image: finalImage, // Link ảnh hoàn chỉnh
                category: p.category
            };
        });
    };

    // Nếu là xem danh sách tổng quát -> Trả về luôn
    if (isShowAll) {
      return res.json({
        reply: "Dạ đây là những bộ LEGO mới nhất vừa cập bến 5BROSLEGO ạ! Bạn xem ưng mẫu nào không nhé? 👇",
        products: processProducts(foundProducts),
        showProducts: true,
      });
    }

    // --- BƯỚC C: CHUẨN BỊ KỊCH BẢN CHO AI ---

    let productContext = "";
    if (foundProducts.length > 0) {
      // Nếu tìm thấy sản phẩm -> Gửi danh sách cho AI đọc
      const list = foundProducts.map((p, i) => `${i+1}. ${p.name} | Giá: ${p.price?.toLocaleString()}đ`).join("\n");
      productContext = `\n[HỆ THỐNG ĐÃ TÌM THẤY CÁC SẢN PHẨM SAU]:\n${list}\n\n-> YÊU CẦU: Hãy giới thiệu ngắn gọn các sản phẩm này và mời khách xem chi tiết bên dưới.`;
    } else {
      // Nếu không tìm thấy
      productContext = "\n[HỆ THỐNG]: Không tìm thấy sản phẩm nào khớp với từ khóa trong Database. Hãy xin lỗi khách khéo léo và gợi ý khách xem các dòng 'LEGO City' hoặc 'Ninjago'.";
    }

    // 🔥 SYSTEM PROMPT (Kịch bản nhập vai)
    const systemPrompt = `
    Bạn là Trợ lý ảo của shop "5BROSLEGO" (Website: https://5broslego.click/).
    
    THÔNG TIN CỐ ĐỊNH:
    - Địa chỉ shop: 5 Đặng Thùy Trâm, Phường 25, Bình Thạnh, TP.HCM.
    - SĐT: 098 746 3921.
    - Giờ mở cửa: 8:00 - 21:00.

    QUY TẮC TRẢ LỜI:
    1. Nếu khách hỏi địa chỉ -> Trả lời chính xác địa chỉ trên.
    2. Dựa vào [HỆ THỐNG] cung cấp để tư vấn sản phẩm. Không được tự bịa sản phẩm không có.
    3. Thân thiện, dùng emoji 😄 🧱. Trả lời ngắn gọn (dưới 3 câu).
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: `${message}\n${productContext}` },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 400,
    });

    const reply = completion.choices?.[0]?.message?.content || "Xin lỗi, mình đang kết nối lại với tổng đài LEGO.";

    res.json({
      reply,
      products: processProducts(foundProducts),
      showProducts: foundProducts.length > 0,
    });

  } catch (error) {
    console.error("❌ Lỗi Chatbot:", error);
    res.status(500).json({ error: "Lỗi xử lý phía server." });
  }
});
// ======================================================

// 3. Xử lý lỗi
app.use(notFound);
app.use(errorHandler);

// 4. Kết nối MongoDB và Chạy Server
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("✅ MongoDB Connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(`❌ MongoDB connection error: ${err.message}`));