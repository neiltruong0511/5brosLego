import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X, MapPin, Phone } from "lucide-react"; // Thêm icon
import { Link } from "react-router-dom";

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Chào bạn! Mình là trợ lý 5BROSLEGO 🧱. Bạn cần tìm bộ LEGO nào hôm nay?" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const chatEndRef = useRef(null);

  // Tự động cuộn xuống cuối
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, suggestedProducts, isLoading]);

  const sendMessage = async (customMessage) => {
    const content = customMessage || input.trim();
    if (!content) return;

    // 1. Hiển thị tin nhắn người dùng
    const userMessage = { from: "user", text: content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setSuggestedProducts([]); // Reset gợi ý cũ

    try {
      // 2. Gọi API (Lưu ý: Đổi URL nếu chạy localhost)
      const API_URL = "https://fivebroslego.onrender.com/api/chat"; 
      // Hoặc dùng: const API_URL = "http://localhost:5000/api/chat";
      
      const response = await axios.post(API_URL, {
        message: content,
        history: messages.map((msg) => ({
          role: msg.from === "bot" ? "assistant" : "user",
          content: msg.text,
        })),
      });

      const { reply, products, showProducts } = response.data;

      // 3. Hiển thị phản hồi AI
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      
      // 4. Hiển thị sản phẩm nếu có
      if (showProducts && products?.length > 0) {
        setSuggestedProducts(products);
      }

    } catch (err) {
      console.error("❌ Lỗi Chat:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "😅 Mạng đang chập chờn chút, bạn hỏi lại giúp mình nhé!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = [
    "Xem hàng mới về 📦",
    "LEGO City 🚓",
    "LEGO Ninjago 🐉",
    "Địa chỉ shop ở đâu? 📍",
  ];

  return (
    <>
      {/* Nút mở Chat */}
      <motion.button
        className="fixed bottom-6 right-6 bg-yellow-500 text-white p-4 rounded-full shadow-xl z-50 hover:bg-yellow-600 border-2 border-white"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={28} /> : <MessageCircle size={28} fill="white" />}
      </motion.button>

      {/* Giao diện Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-[90vw] md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden font-sans"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            {/* Header */}
            <div className="bg-yellow-500 p-4 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-2">
                <div className="bg-white p-1 rounded-full">
                  <img src="https://img.icons8.com/color/48/lego.png" alt="Logo" className="w-6 h-6"/>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg leading-none">5BROSLEGO AI</h3>
                  <span className="text-yellow-100 text-xs flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span> Online
                  </span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-yellow-600 p-1 rounded">
                <X size={20} />
              </button>
            </div>

            {/* Nội dung Chat */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 max-h-[400px] min-h-[300px]">
              <div className="space-y-3">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`px-4 py-2 rounded-2xl text-sm max-w-[80%] shadow-sm ${
                        msg.from === "user"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 border border-gray-100 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white p-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex gap-1">
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                      <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>
            </div>

            {/* Khu vực hiển thị sản phẩm gợi ý */}
            {suggestedProducts.length > 0 && (
              <div className="bg-gray-100 p-3 border-t border-gray-200">
                <p className="text-xs font-bold text-gray-500 mb-2 uppercase">Có thể bạn sẽ thích:</p>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {suggestedProducts.map((p) => (
                    <Link
                      key={p._id}
                      to={`/product/${p._id}`}
                      className="min-w-[120px] w-[120px] bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all flex flex-col"
                    >
                      <div className="h-24 bg-gray-100 w-full flex items-center justify-center">
                         <img
                          src={p.image || "https://via.placeholder.com/100"}
                          alt={p.name}
                          className="h-full w-full object-contain"
                        />
                      </div>
                      <div className="p-2 flex flex-col flex-1 justify-between">
                        <h4 className="text-xs font-medium truncate text-gray-800" title={p.name}>{p.name}</h4>
                        <span className="text-red-600 font-bold text-xs mt-1">
                          {p.price?.toLocaleString()}đ
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Input Area */}
            <div className="bg-white border-t p-3">
              {/* Gợi ý nhanh */}
              <div className="flex gap-2 overflow-x-auto mb-2 scrollbar-hide">
                {quickReplies.map((text, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(text)}
                    className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-blue-50 text-gray-600 text-xs rounded-full border border-gray-200 transition"
                  >
                    {text}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-gray-100 text-gray-800 text-sm rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 disabled:bg-gray-300 transition-all"
                >
                  <Send size={18} />
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