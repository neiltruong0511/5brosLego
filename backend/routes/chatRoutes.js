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

    // ✅ Danh mục LEGO thật trong cửa hàng
    const categories = [
      "Lego Architecture",
      "Lego City",
      "Lego Friends",
      "Lego Technic",
      "Lego Ninjago",
      "Lego DC Super Heroes",
    ];

    // ✅ Xác định xem người dùng có đang nói về sản phẩm không
    const productIntent = /(lego|sản phẩm|bộ|giá|mua|xem|set|đồ chơi)/i.test(message);

    // ✅ Tự động nhận diện danh mục LEGO mà người dùng đề cập
    const detectedCategory = categories.find((cat) =>
      message.toLowerCase().includes(cat.toLowerCase().replace("lego ", ""))
    );

    // ✅ Nếu có danh mục cụ thể → lọc theo category, ngược lại → tìm theo từ khóa
    const query = detectedCategory
      ? { category: detectedCategory }
      : {
          $or: [
            { name: { $regex: message, $options: "i" } },
            { category: { $regex: message, $options: "i" } },
            { description: { $regex: message, $options: "i" } },
          ],
        };

    // ✅ Lấy sản phẩm phù hợp (mới nhất trước)
    const foundProducts = productIntent
      ? await Product.find(query).sort({ createdAt: -1 }).limit(5).lean()
      : [];

    // ✅ Chuẩn bị ngữ cảnh sản phẩm thật cho AI
    const productContext =
      foundProducts.length > 0
        ? `Dưới đây là các sản phẩm thật trong kho LEGO:\n\n${foundProducts
            .map(
              (p, i) =>
                `${i + 1}. ${p.name}\n💰 Giá: ${p.price.toLocaleString()} VNĐ\n🏷️ Danh mục: ${p.category}\n📦 Tồn kho: ${p.stock}\n📝 Mô tả: ${p.description}`
            )
            .join("\n\n")}`
        : `Không tìm thấy sản phẩm phù hợp trong kho LEGO.
Hãy gợi ý khách hàng những dòng nổi bật hiện có:
- LEGO Architecture 🏛️
- LEGO City 🚗
- LEGO Friends 💖
- LEGO Technic ⚙️
- LEGO Ninjago 🐉
- LEGO DC Super Heroes 🦸‍♂️`;

    // ✅ Tạo lịch sử hội thoại gửi đến OpenAI
    const messages = [
      {
        role: "system",
        content: `
        Bạn là trợ lý bán hàng LEGO thân thiện 😄  
        Nhiệm vụ của bạn:
        - Giới thiệu sản phẩm dựa trên dữ liệu thật (không bịa).
        - Nếu có sản phẩm phù hợp, hãy nói ngắn gọn, vui vẻ, dùng emoji.
        - Nếu không có sản phẩm, hãy gợi ý khách hàng những dòng LEGO nổi bật trong cửa hàng.
        - Luôn ưu tiên trả lời bằng tiếng Việt, giọng thân thiện, tự nhiên.
        - Không nói về sản phẩm ngoài LEGO.`,
      },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: `${message}\n\n${productContext}` },
    ];

    // ✅ Gọi OpenAI để tạo phản hồi
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "😅 Xin lỗi, tôi chưa rõ bạn muốn tìm sản phẩm nào.";

    // ✅ Trả về sản phẩm có ảnh (ưu tiên ảnh đầu tiên)
    const productsWithImage = foundProducts.map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category,
      description: p.description,
      image: Array.isArray(p.imageUrl) ? p.imageUrl[0] : p.imageUrl,
    }));

    // ✅ Gửi kết quả phản hồi
    res.json({
      reply,
      products: productsWithImage,
      showProducts: foundProducts.length > 0,
    });
  } catch (err) {
    console.error("❌ Lỗi /api/chat:", err);
    res.status(500).json({ error: "Lỗi khi gọi OpenAI API" });
  }
});

export default router;


