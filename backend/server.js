// ======================= server.js =======================
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const apiRoutes = require("./api"); // Import routes
const OpenAI = require("openai"); // Chatbot SDK

// Load environment variables
dotenv.config();

const app = express();

// ==================== Middleware ====================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"], // React dev servers
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve uploaded files (images, etc.)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Mount main API routes
app.use("/api", apiRoutes);

// ==================== LEGO Chatbot API ====================
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // 🔑 lấy từ .env
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Thiếu tin nhắn gửi đến chatbot." });
    }

    const messages = [
      {
        role: "system",
        content:
          "Bạn là chatbot hỗ trợ cửa hàng LEGO 🧱, thân thiện, năng động và hay dùng emoji 😄.",
      },
      ...(Array.isArray(history) ? history : []),
      { role: "user", content: message },
    ];

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 800,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Xin lỗi 😅, tôi chưa có câu trả lời phù hợp cho điều này.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Lỗi chat API:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi xử lý chatbot." });
  }
});
// ======================================================

// Error handlers
app.use(notFound);
app.use(errorHandler);

// ==================== MongoDB Connection ====================
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
