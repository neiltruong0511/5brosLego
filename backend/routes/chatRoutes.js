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

    // ✅ Xác định người dùng đang hỏi về sản phẩm LEGO hay không
    const productIntent = /(lego|sản phẩm|bộ|giá|mua|xem|set|đồ chơi)/i.test(message);

    // 🔍 Tìm sản phẩm phù hợp
    const foundProducts = productIntent
      ? await Product.find({
          $or: [
            { name: { $regex: message, $options: "i" } },
            { category: { $regex: message, $options: "i" } },
            { description: { $regex: message, $options: "i" } },
          ],
        })
          .limit(5)
          .lean()
      : [];

    const productContext =
      foundProducts.length > 0
        ? `Dưới đây là thông tin sản phẩm thật trong kho LEGO:\n\n${foundProducts
            .map(
              (p, i) =>
                `${i + 1}. ${p.name}\n💰 Giá: ${p.price.toLocaleString()} VNĐ\n🏷️ Danh mục: ${p.category}\n📦 Tồn kho: ${p.stock}\n📝 Mô tả: ${p.description}`
            )
            .join("\n\n")}`
        : "Không tìm thấy sản phẩm phù hợp trong kho LEGO. Hãy gợi ý khách hàng những dòng phổ biến như LEGO City, Technic, Ninjago hoặc Star Wars.";

    const messages = [
      {
        role: "system",
        content: `
        Bạn là trợ lý bán hàng LEGO thân thiện 😄  
        Nếu có dữ liệu thật thì tóm tắt ngắn gọn, vui vẻ và dùng emoji.  
        Nếu có sản phẩm phù hợp, nói thêm câu như “Mình tìm được vài bộ LEGO bạn có thể thích nè!”.  
        Nếu không có sản phẩm, hãy gợi ý khách hàng các dòng nổi bật.  
        Tuyệt đối không bịa thông tin hoặc giá.`,
      },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: `${message}\n\n${productContext}` },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Xin lỗi 😅, tôi chưa rõ bạn muốn tìm sản phẩm nào.";

    const productsWithImage = foundProducts.map((p) => ({
      _id: p._id,
      name: p.name,
      price: p.price,
      stock: p.stock,
      category: p.category,
      description: p.description,
      image: Array.isArray(p.imageUrl) ? p.imageUrl[0] : p.imageUrl,
    }));

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

