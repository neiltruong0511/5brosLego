import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import Product from "../models/ProductModels.js";

dotenv.config();
const router = express.Router();

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: "Thiếu nội dung tin nhắn!" });

    const userMsg = message.toLowerCase();

    // --- KỊCH BẢN 1: KHÁCH MUỐN XEM TẤT CẢ / SẢN PHẨM MỚI ---
    if (userMsg.match(/(tất cả|all|danh sách|mới nhất|show|xem hàng)/)) {
      const allProducts = await Product.find()
        .sort({ createdAt: -1 })
        .limit(10) // Lấy 10 sản phẩm mới nhất
        .select('name price category stock imageUrl')
        .lean();

      return res.json({
        reply: "🎉 Dạ đây là những mẫu LEGO mới nhất vừa cập bến tại 5BROSLEGO ạ! Bạn ưng mẫu nào cứ bấm vào xem chi tiết nhé 👇",
        products: processProductsImages(allProducts),
        showProducts: true,
      });
    }

    // --- KỊCH BẢN 2: TÌM KIẾM SẢN PHẨM CỤ THỂ ---
    
    // 1. Xác định danh mục (nếu có)
    const categories = ["Architecture", "City", "Friends", "Technic", "Ninjago", "DC Super Heroes"];
    const detectedCategory = categories.find(cat => userMsg.includes(cat.toLowerCase()));

    // 2. Tạo query tìm kiếm
    let query = {};
    if (detectedCategory) {
      query = { category: { $regex: detectedCategory, $options: "i" } };
    } else {
      // Tìm theo tên hoặc mô tả
      query = {
        $or: [
          { name: { $regex: message, $options: "i" } },
          { description: { $regex: message, $options: "i" } },
          { category: { $regex: message, $options: "i" } }
        ]
      };
    }

    // 3. Gọi DB
    // Chỉ tìm sản phẩm nếu câu hỏi có liên quan đến mua sắm/lego
    const isShoppingIntent = /(lego|giá|mua|tìm|có mẫu|bộ|set|bi nhiêu)/.test(userMsg);
    
    let foundProducts = [];
    if (isShoppingIntent || detectedCategory) {
      foundProducts = await Product.find(query).limit(5).lean();
    }

    // --- KỊCH BẢN 3: GỬI DỮ LIỆU CHO AI (OPENAI) ---

    // Tạo bối cảnh dữ liệu sản phẩm cho AI đọc
    let productContext = "";
    if (foundProducts.length > 0) {
      const list = foundProducts.map((p, i) => 
        `${i+1}. ${p.name} | Giá: ${p.price?.toLocaleString()}đ | Kho: ${p.stock}`
      ).join("\n");
      productContext = `Dưới đây là danh sách sản phẩm thực tế shop đang có khớp với câu hỏi:\n${list}\n\nHãy giới thiệu các sản phẩm này cho khách.`;
    } else if (isShoppingIntent) {
      productContext = "Hiện tại hệ thống không tìm thấy sản phẩm nào khớp với từ khóa của khách. Hãy khéo léo xin lỗi và gợi ý khách xem các danh mục khác.";
    }

    // 🔥 KỊCH BẢN CHÍNH (SYSTEM PROMPT)
    const systemPrompt = `
    Bạn là "Trợ lý ảo AI" của cửa hàng "5BROSLEGO" (Website: https://5broslego.click/).
    
    THÔNG TIN CỬA HÀNG:
    - Địa chỉ: 5 Đặng Thùy Trâm, Phường 25, Bình Thạnh, TP.HCM.
    - SĐT: +98 7463921.
    
    PHONG CÁCH TRẢ LỜI:
    - Thân thiện, nhiệt tình, dùng nhiều emoji 😄 🧱 🚀.
    - Trả lời ngắn gọn (dưới 3 câu).
    - Luôn hướng khách hàng đến việc mua hàng trên website.
    
    QUY TẮC QUAN TRỌNG:
    1. Nếu có danh sách sản phẩm được cung cấp trong [Context], hãy mời khách xem bên dưới.
    2. Nếu khách hỏi địa chỉ hoặc liên hệ, hãy cung cấp thông tin cửa hàng ở trên.
    3. Nếu khách hỏi vấn đề không liên quan đến LEGO, hãy từ chối khéo léo.
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(history) ? history : []), // Lịch sử chat
      { role: "user", content: `${message}\n\n[CONTEXT DỮ LIỆU]: ${productContext}` },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    // Trả kết quả về Frontend
    res.json({
      reply,
      products: processProductsImages(foundProducts),
      showProducts: foundProducts.length > 0,
    });

  } catch (err) {
    console.error("❌ Lỗi Chat AI:", err);
    res.status(500).json({ error: "Lỗi xử lý server" });
  }
});

// Hàm phụ trợ xử lý ảnh (để tránh lỗi null/array)
const processProductsImages = (products) => {
  return products.map(p => ({
    _id: p._id,
    name: p.name,
    price: p.price,
    image: Array.isArray(p.imageUrl) ? p.imageUrl[0] : p.imageUrl,
    category: p.category
  }));
};

export default router;