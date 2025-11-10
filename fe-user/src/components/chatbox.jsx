import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { Link } from "react-router-dom";

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Xin chào! Mình là trợ lý LEGO AI — bạn muốn xem bộ LEGO nào nè?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, suggestedProducts]);

  const sendMessage = async (customMessage) => {
    const content = customMessage || input.trim();
    if (!content) return;

    const userMessage = { from: "user", text: content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("https://fivebroslego.onrender.com/api/chat", {
        message: content,
        history: messages.map((msg) => ({
          role: msg.from === "bot" ? "assistant" : "user",
          content: msg.text,
        })),
      });

      const { reply, products, showProducts } = response.data;
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      setSuggestedProducts(showProducts ? products || [] : []);
    } catch (err) {
      console.error("❌ Lỗi khi gửi tin nhắn:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "😅 Xin lỗi, tôi đang gặp sự cố. Hãy thử lại nhé!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = [
    "LEGO City 🚗",
    "LEGO Technic 🔧",
    "LEGO Friends 💖",
    "LEGO Ninjago 🐉",
    "LEGO DC Super Heroes 🦸‍♂️",
    "LEGO Architecture 🏛️",
  ];

  return (
    <>
      {/* 🔘 Nút bật/tắt chat */}
      <motion.button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* 💬 Hộp chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-blue-600 text-white p-3 rounded-t-2xl font-semibold flex justify-between items-center">
              💬 Trợ lý LEGO AI
              <button onClick={() => setIsOpen(false)}>
                <X size={18} className="text-white" />
              </button>
            </div>

            <div className="flex-1 p-3 overflow-y-auto max-h-96 space-y-2">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-2 rounded-lg text-sm max-w-[75%] ${
                      msg.from === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && <div className="text-gray-400 text-xs italic">Đang soạn phản hồi...</div>}
              <div ref={chatEndRef} />
            </div>

            {/* 🧱 Gợi ý sản phẩm */}
            {suggestedProducts.length > 0 && (
              <div className="border-t border-gray-200 p-3 bg-gray-50">
                <div className="font-semibold text-sm mb-2 text-gray-600">🧱 Gợi ý sản phẩm phù hợp:</div>
                <div className="grid grid-cols-2 gap-2">
                  {suggestedProducts.map((p) => (
                    <Link
                      key={p._id}
                      to={`/product/${p._id}`}
                      className="border rounded-md overflow-hidden hover:shadow-md transition"
                    >
                      {p.image && (
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-24 object-cover"
                        />
                      )}
                      <div className="p-1 text-xs text-center">
                        <div className="font-semibold truncate">{p.name}</div>
                        <div className="text-blue-600 font-bold">
                          {p.price?.toLocaleString()}đ
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Nút nhanh + input */}
            <div className="flex flex-col border-t">
              <div className="flex flex-wrap gap-2 px-3 py-2 bg-gray-50">
                {quickReplies.map((text, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(text)}
                    className="bg-gray-200 hover:bg-blue-100 text-gray-700 text-xs rounded-full px-3 py-1 transition"
                  >
                    {text}
                  </button>
                ))}
              </div>

              <div className="flex p-3 border-t">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none"
                />
                <button
                  onClick={() => sendMessage()}
                  className="ml-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbox;


