// ======================= server.js =======================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const apiRoutes = require("./api"); 
const OpenAI = require("openai"); 
// 👇 QUAN TRỌNG: Phải import Model Sản phẩm để tìm kiếm
const Product = require("./models/ProductModels"); 

dotenv.config();
const app = express();

// ==================== Middleware ====================
app.use(
  cors({
    // Cho phép localhost và domain thật truy cập
    origin: ["http://localhost:5173", "http://localhost:3000", "https://5broslego.click", "https://www.5broslego.click"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", apiRoutes);

// ==================== 🤖 CHATBOT THÔNG MINH (V2) ====================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "Thiếu tin nhắn." });

    const userMsg = message.toLowerCase();
    let foundProducts = [];
    let isShowAll = false;
    let systemInstruction = ""; // Chỉ thị riêng cho từng trường hợp

    // --- 1. XỬ LÝ TÌM KIẾM SẢN PHẨM TỪ MONGODB ---
    
    // A. Khách muốn xem "Tất cả" hoặc "Mới nhất"
    if (userMsg.match(/(tất cả|all|danh sách|mới nhất|show|xem hàng|sản phẩm)/) && !userMsg.match(/(tìm|giá|lego)/)) {
      foundProducts = await Product.find().sort({ createdAt: -1 }).limit(6).lean();
      isShowAll = true;
    } 
    // B. Khách tìm cụ thể (Ví dụ: "Lego Technic", "Xe đua")
    else {
      // Danh sách từ khóa danh mục
      const categories = ["Architecture", "City", "Friends", "Technic", "Ninjago", "DC Super Heroes", "Star Wars", "Harry Potter"];
      const detectedCategory = categories.find(cat => userMsg.includes(cat.toLowerCase()));
      
      let query = {};
      if (detectedCategory) {
        query = { category: { $regex: detectedCategory, $options: "i" } };
      } else {
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

    // Hàm xử lý ảnh (để frontend không bị lỗi)
    const processProducts = (products) => {
      return products.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        image: (p.imageUrl && p.imageUrl.length > 0) ? p.imageUrl[0] : "https://via.placeholder.com/150",
        category: p.category
      }));
    };

    // Nếu là xem danh sách -> Trả về luôn
    if (isShowAll) {
      return res.json({
        reply: "Dạ đây là những bộ LEGO mới nhất vừa cập bến 5BROSLEGO ạ! Bạn xem ưng mẫu nào không nhé? 👇",
        products: processProducts(foundProducts),
        showProducts: true,
      });
    }

    // --- 2. CHUẨN BỊ KỊCH BẢN CHO AI ---

    let productContext = "";
    if (foundProducts.length > 0) {
      // Nếu tìm thấy sản phẩm -> Gửi danh sách cho AI đọc
      const list = foundProducts.map((p, i) => `${i+1}. ${p.name} | Giá: ${p.price?.toLocaleString()}đ`).join("\n");
      productContext = `\n[HỆ THỐNG ĐÃ TÌM THẤY CÁC SẢN PHẨM NÀY TRONG KHO]:\n${list}\n\n-> YÊU CẦU: Hãy giới thiệu ngắn gọn các sản phẩm trên và mời khách xem hình ảnh bên dưới.`;
    } else {
      // Nếu không tìm thấy -> Dặn AI xin lỗi
      productContext = "\n[HỆ THỐNG]: Không tìm thấy sản phẩm nào khớp với từ khóa trong Database. Hãy xin lỗi khách khéo léo và gợi ý khách xem các dòng 'LEGO City' hoặc 'Ninjago'.";
    }

    // 🔥 SYSTEM PROMPT CỐ ĐỊNH (CHỨA ĐỊA CHỈ)
    const systemPrompt = `
    Bạn là Trợ lý ảo của shop "5BROSLEGO" (Website: https://5broslego.click/).
    
    THÔNG TIN BẮT BUỘC PHẢI NHỚ:
    - Địa chỉ shop: Số 5 Đặng Thùy Trâm, Phường 25, Quận Bình Thạnh, TP.HCM.
    - SĐT: 098 746 3921.
    - Giờ mở cửa: 8:00 - 21:00 hằng ngày.

    QUY TẮC TRẢ LỜI:
    1. Nếu khách hỏi địa chỉ -> Bắt buộc trả lời chính xác địa chỉ trên.
    2. Nếu hệ thống cung cấp danh sách sản phẩm -> Hãy giới thiệu và báo giá.
    3. Thân thiện, dùng emoji 😄 🧱. Trả lời ngắn gọn.
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

// Error handlers
app.use(notFound);
app.use(errorHandler);

// MongoDB Connection
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