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

    // Sửa phần kiểm tra message
  const askingForAll = message.toLowerCase().match(/tất cả|all|danh sách|hiện|xem|show/);

  // Sửa phần tìm sản phẩm
  let foundProducts;
  if (askingForAll) {
    // Tăng limit lên và bỏ các điều kiện lọc
    foundProducts = await Product.find()
      .limit(20)  // Tăng số lượng sản phẩm hiển thị
      .select('name price category stock description imageUrl') // Chọn các trường cần thiết
      .lean();
      
    // Tạo reply thân thiện hơn khi hiển thị tất cả
    const reply = `🎉 Đây là danh sách ${foundProducts.length} sản phẩm LEGO hot nhất của shop:\n\n` +
      foundProducts.map((p, i) => 
        `${i+1}. ${p.name} - ${p.price.toLocaleString()}đ\n`
      ).join('');
      
    return res.json({
      reply,
      products: foundProducts.map(p => ({
        ...p,
        image: Array.isArray(p.imageUrl) ? p.imageUrl[0] : p.imageUrl
      }))
    });
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
