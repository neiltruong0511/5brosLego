import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import Product from "../models/ProductModels.js"; // Đảm bảo đường dẫn đúng

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
    let foundProducts = [];
    let isShowAll = false;

    // --- 1. TÌM KIẾM SẢN PHẨM TỪ MONGODB ---

    // A. Nếu khách muốn xem "Tất cả" hoặc "Mới nhất"
    if (userMsg.match(/(tất cả|all|danh sách|mới nhất|show|xem hàng|sản phẩm)/) && !userMsg.match(/(tìm|giá|lego)/)) {
      foundProducts = await Product.find()
        .sort({ createdAt: -1 }) // Lấy sản phẩm mới tạo nhất
        .limit(6)
        .lean();
      isShowAll = true;
    } 
    // B. Nếu khách tìm kiếm cụ thể
    else {
      // Các danh mục LEGO (Khớp với field 'category' trong DB)
      const categories = ["Architecture", "City", "Friends", "Technic", "Ninjago", "DC Super Heroes", "Star Wars"];
      const detectedCategory = categories.find(cat => userMsg.includes(cat.toLowerCase()));

      let query = {};
      
      if (detectedCategory) {
        // Tìm theo danh mục
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

      // Chỉ tìm nếu câu hỏi mang ý định mua sắm
      const isShoppingIntent = /(lego|giá|mua|tìm|có mẫu|bộ|set|bi nhiêu|tư vấn|shop)/.test(userMsg);
      
      if (isShoppingIntent || detectedCategory) {
        foundProducts = await Product.find(query).limit(5).lean();
      }
    }

    // --- 2. XỬ LÝ KẾT QUẢ ---

    // Hàm xử lý dữ liệu sản phẩm trước khi trả về
    const processProducts = (products) => {
      return products.map(p => ({
        _id: p._id,
        name: p.name,
        price: p.price,
        // Xử lý mảng imageUrl: Lấy ảnh đầu tiên, nếu không có thì để null
        image: (p.imageUrl && p.imageUrl.length > 0) ? p.imageUrl[0] : "",
        category: p.category,
        stock: p.stock
      }));
    };

    // Nếu chỉ xem danh sách, trả về luôn
    if (isShowAll) {
      return res.json({
        reply: "Dạ đây là những bộ LEGO mới nhất vừa cập bến 5BROSLEGO ạ! Bạn xem ưng mẫu nào không nhé? 👇",
        products: processProducts(foundProducts),
        showProducts: true,
      });
    }

    // --- 3. GỬI CHO AI (KỊCH BẢN) ---

    // Tạo Context dữ liệu cho AI đọc
    let productContext = "";
    if (foundProducts.length > 0) {
      const list = foundProducts.map((p, i) => 
        `${i+1}. ${p.name} | Giá: ${p.price?.toLocaleString()}đ | Kho: ${p.stock} | Loại: ${p.category}`
      ).join("\n");
      productContext = `DỮ LIỆU SẢN PHẨM TÌM THẤY:\n${list}\n\n-> HÃY DÙNG THÔNG TIN NÀY ĐỂ TƯ VẤN.`;
    } else {
      productContext = "KHÔNG TÌM THẤY SẢN PHẨM NÀO TRONG KHO KHỚP VỚI CÂU HỎI.";
    }

    // Kịch bản System Prompt
    const systemPrompt = `
    Bạn là Trợ lý ảo của shop "5BROSLEGO" (Website: https://5broslego.click/).
    
    THÔNG TIN SHOP:
    - Địa chỉ: 5 Đặng Thùy Trâm, P.25, Bình Thạnh, TP.HCM.
    - Đặc điểm: Chuyên LEGO chính hãng, giá tốt.

    NHIỆM VỤ:
    - Trả lời ngắn gọn, thân thiện, dùng emoji 😄.
    - Nếu có [DỮ LIỆU SẢN PHẨM TÌM THẤY], hãy giới thiệu sơ lược và mời khách xem bên dưới.
    - Nếu [KHÔNG TÌM THẤY], hãy xin lỗi và gợi ý khách xem các dòng khác như City, Ninjago...
    `;

    const messages = [
      { role: "system", content: systemPrompt },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: `${message}\n\n${productContext}` },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const reply = completion.choices[0].message.content;

    res.json({
      reply,
      products: processProducts(foundProducts), // Trả về danh sách đã xử lý ảnh
      showProducts: foundProducts.length > 0,
    });

  } catch (err) {
    console.error("❌ Lỗi Chat AI:", err);
    res.status(500).json({ error: "Lỗi xử lý server" });
  }
});

export default router;