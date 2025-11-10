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
    if (!message)
      return res.status(400).json({ error: "Thiếu nội dung tin nhắn!" });

    // ✅ Danh mục LEGO có thật trong cửa hàng
    const categories = [
      "LEGO Architecture",
      "LEGO City",
      "LEGO Friends",
      "LEGO Technic",
      "LEGO Ninjago",
      "LEGO DC Super Heroes",
    ];

    // ✅ Phát hiện người dùng nói về sản phẩm
    const productIntent = /(lego|sản phẩm|bộ|giá|mua|set|đồ chơi)/i.test(message);

    // ✅ Tự động xác định danh mục LEGO
    const detectedCategory = categories.find((cat) =>
      message.toLowerCase().includes(cat.toLowerCase().replace("lego ", ""))
    );

    // ✅ Tạo truy vấn MongoDB
    const query = detectedCategory
      ? { category: detectedCategory }
      : {
          $or: [
            { name: { $regex: message, $options: "i" } },
            { category: { $regex: message, $options: "i" } },
            { description: { $regex: message, $options: "i" } },
          ],
        };

    // ✅ Lấy sản phẩm thực tế từ MongoDB
    const foundProducts = productIntent
      ? await Product.find(query).sort({ createdAt: -1 }).limit(5).lean()
      : [];

    // ✅ Bối cảnh cho AI (để nó trả lời thân thiện)
    const productContext =
      foundProducts.length > 0
        ? `Dưới đây là các sản phẩm thật trong cửa hàng LEGO:\n\n${foundProducts
            .map(
              (p, i) =>
                `${i + 1}. ${p.name}\n💰 Giá: ${p.price.toLocaleString()}đ\n🏷️ Danh mục: ${p.category}\n📦 Tồn kho: ${p.stock}\n📝 Mô tả: ${p.description}`
            )
            .join("\n\n")}`
        : `Không tìm thấy sản phẩm phù hợp. Gợi ý khách hàng xem các danh mục sau:
- LEGO Architecture 🏛️
- LEGO City 🚗
- LEGO Friends 💖
- LEGO Technic ⚙️
- LEGO Ninjago 🐉
- LEGO DC Super Heroes 🦸‍♂️`;

    // ✅ Chuẩn bị hội thoại cho AI
    const messages = [
      {
        role: "system",
        content: `
        Bạn là trợ lý LEGO AI thân thiện 😄
        - Dựa trên dữ liệu thật của sản phẩm.
        - Trả lời ngắn gọn, tự nhiên, có emoji, như nhân viên tư vấn LEGO thật.
        - Nếu không có sản phẩm, gợi ý danh mục khác.`,
      },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: `${message}\n\n${productContext}` },
    ];

    // ✅ Gọi OpenAI API
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "😅 Xin lỗi, tôi chưa rõ bạn muốn tìm sản phẩm nào.";

    // ✅ Dọn dữ liệu gửi về FE
    const productsWithImage = foundProducts.map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category,
      description: p.description,
      image:
        Array.isArray(p.imageUrl) && p.imageUrl.length > 0
          ? p.imageUrl[0]
          : typeof p.imageUrl === "string"
          ? p.imageUrl
          : null,
    }));

    res.json({
      reply,
      products: productsWithImage,
      showProducts: foundProducts.length > 0,
    });
  } catch (err) {
    console.error("❌ Lỗi /api/chat:", err);
    res.status(500).json({ error: "Lỗi khi xử lý yêu cầu AI" });
  }
});

export default router;




