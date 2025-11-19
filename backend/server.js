// ======================= server.js =======================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const apiRoutes = require("./api"); 
const OpenAI = require("openai"); 
const Product = require("./models/ProductModels"); // ✅ Import Model Sản Phẩm

dotenv.config();
const app = express();

// ==================== Middleware ====================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "https://5broslego.click"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount main API routes
app.use("/api", apiRoutes);

// ==================== LEGO Chatbot API (Đã nâng cấp) ====================
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

    // 1. XỬ LÝ TÌM KIẾM SẢN PHẨM TỪ DB
    // A. Khách muốn xem hàng mới / tất cả
    if (userMsg.match(/(tất cả|all|danh sách|mới nhất|show|xem hàng|sản phẩm)/) && !userMsg.match(/(tìm|giá|lego)/)) {
      foundProducts = await Product.find().sort({ createdAt: -1 }).limit(6).lean();
      isShowAll = true;
    } 
    // B. Khách tìm cụ thể
    else {
      const categories = ["Architecture", "City", "Friends", "Technic", "Ninjago", "DC Super Heroes", "Star Wars"];
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

      const isShoppingIntent = /(lego|giá|mua|tìm|có mẫu|bộ|set|bi nhiêu|tư vấn|shop)/.test(userMsg);
      if (isShoppingIntent || detectedCategory) {
        foundProducts = await Product.find(query).limit(5).lean();
      }
    }

    // Hàm xử lý ảnh (Tránh lỗi null)
    const processProducts = (products) => {
      return products.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        image: (p.imageUrl && p.imageUrl.length > 0) ? p.imageUrl[0] : "",
        category: p.category
      }));
    };

    // Trả về ngay nếu chỉ xem danh sách
    if (isShowAll) {
      return res.json({
        reply: "Dạ đây là những mẫu LEGO mới nhất tại 5BROSLEGO ạ! Bạn xem ưng mẫu nào không nhé? 👇",
        products: processProducts(foundProducts),
        showProducts: true,
      });
    }

    // 2. GỬI CHO AI (OPENAI)
    let productContext = "";
    if (foundProducts.length > 0) {
      const list = foundProducts.map((p, i) => `${i+1}. ${p.name} | Giá: ${p.price?.toLocaleString()}đ`).join("\n");
      productContext = `DỮ LIỆU SẢN PHẨM TÌM THẤY:\n${list}\n\n-> Hãy giới thiệu các sản phẩm này cho khách.`;
    } else {
      productContext = "Không tìm thấy sản phẩm nào khớp. Hãy gợi ý khách xem các danh mục khác.";
    }

    const messages = [
      {
        role: "system",
        content: "Bạn là trợ lý ảo của shop 5BROSLEGO (5 Đặng Thùy Trâm, Bình Thạnh). Thân thiện, dùng emoji 😄. Chỉ tư vấn dựa trên dữ liệu được cung cấp.",
      },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: `${message}\n\n${productContext}` },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 400,
    });

    const reply = completion.choices?.[0]?.message?.content || "Xin lỗi, tôi chưa rõ ý bạn.";

    res.json({
      reply,
      products: processProducts(foundProducts),
      showProducts: foundProducts.length > 0,
    });

  } catch (error) {
    console.error("❌ Lỗi chat API:", error);
    res.status(500).json({ error: "Lỗi Server Chatbot" });
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