import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import Product from "../models/ProductModels.js";

dotenv.config();
const router = express.Router();

// ✅ OpenAI client
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 💬 Chat endpoint
router.post("/", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Thiếu nội dung tin nhắn!" });
    }

    // 🔍 Thêm logic để kiểm tra nếu tin nhắn hỏi về tất cả sản phẩm
    const askingForAll = message.toLowerCase().includes('tất cả') || 
                        message.toLowerCase().includes('all') ||
                        message.toLowerCase().includes('danh sách') ||
                        message.toLowerCase().includes('hiện') ||
                        message.toLowerCase().includes('xem');

    // Nếu hỏi tất cả, lấy toàn bộ sản phẩm (giới hạn 10 sản phẩm)
    let foundProducts;
    if (askingForAll) {
      foundProducts = await Product.find({})
        .limit(10)
        .lean();
    } else {
      // Tìm kiếm theo từ khóa như cũ
      foundProducts = await Product.find({
        $or: [
          { name: { $regex: message, $options: "i" } },
          { category: { $regex: message, $options: "i" } },
          { description: { $regex: message, $options: "i" } },
        ],
      })
        .limit(5)
        .lean();
    }
    // Cập nhật nội dung phản hồi tùy theo kết quả
    const productContext = foundProducts.length > 0
      ? `Dưới đây là ${askingForAll ? 'danh sách' : 'thông tin'} sản phẩm LEGO:\n\n${foundProducts
          .map(
            (p, i) =>
              `${i + 1}. ${p.name}\n💰 Giá: ${p.price.toLocaleString()} VNĐ\n🏷️ Danh mục: ${p.category}\n📦 Tồn kho: ${p.stock}\n📝 Mô tả: ${p.description}`
          )
          .join("\n\n")}`
      : "Không tìm thấy sản phẩm phù hợp trong kho LEGO. Hãy gợi ý khách hàng những dòng phổ biến như LEGO City, Technic, Ninjago hoặc Star Wars.";
    // 💬 Tạo hội thoại gửi cho AI
    const messages = [
      {
        role: "system",
        content: `
        Bạn là trợ lý bán hàng LEGO thân thiện và hiểu biết 😄  
        Hãy trả lời ngắn gọn, vui vẻ, dùng emoji thân thiện.  
        Nếu có dữ liệu thật, hãy mô tả đúng và rõ ràng.  
        Nếu không có dữ liệu, gợi ý khách hàng các dòng phổ biến như LEGO City, Ninjago, Technic, hoặc Star Wars.  
        Không được bịa thông tin hoặc giá sản phẩm.`,
      },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: `${message}\n\n${productContext}` },
    ];

    // 🔮 Gọi OpenAI API
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Xin lỗi 😅, tôi chưa rõ bạn muốn tìm sản phẩm nào.";

    // 🖼 Chuẩn bị dữ liệu sản phẩm gửi về FE
    const productsWithImage = foundProducts.map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category,
      description: p.description,
      image: Array.isArray(p.imageUrl) ? p.imageUrl[0] : p.imageUrl,
    }));

    res.json({ reply, products: productsWithImage });
  } catch (err) {
    console.error("❌ Lỗi /api/chat:", err);
    res.status(500).json({ error: "Lỗi khi gọi OpenAI API" });
  }
});

export default router;
