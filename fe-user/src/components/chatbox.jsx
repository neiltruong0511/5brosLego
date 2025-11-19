import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { Link } from "react-router-dom"; // Để chuyển hướng sang trang chi tiết

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { from: "bot", text: "👋 Chào bạn! Mình là trợ lý 5BROSLEGO 🧱. Bạn cần tìm bộ LEGO nào? (Ví dụ: Xe đua, Nhà cửa, Ninjago...)" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  // Tự động cuộn
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading, isOpen]);

  const sendMessage = async (customMessage) => {
    const content = customMessage || input.trim();
    if (!content) return;

    const userMessage = { from: "user", text: content };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // GỌI API (Đổi URL nếu bạn đã deploy lên render)
      // Ví dụ: const API_URL = "https://fivebroslego.onrender.com/api/chat";
      const API_URL = "https://fivebroslego.onrender.com/api/chat"; 
      
      const response = await axios.post(API_URL, {
        message: content,
        history: messages.map((msg) => ({
          role: msg.from === "bot" ? "assistant" : "user",
          content: msg.text,
        })),
      });

      const { reply, products } = response.data;

      setMessages((prev) => [
        ...prev, 
        { 
          from: "bot", 
          text: reply,
          products: products || [] 
        }
      ]);

    } catch (err) {
      console.error("Lỗi Chat:", err);
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "😅 Mạng đang chập chờn, bạn thử lại giúp mình nhé!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickReplies = ["LEGO Mới nhất 📦", "LEGO City 🚓", "LEGO Ninjago 🐉", "Địa chỉ shop 📍"];

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

      {/* Khung Chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-[90vw] md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden font-sans"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
          >
            {/* Header */}
            <div className="bg-yellow-500 p-4 flex justify-between items-center text-white shadow-md">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="font-bold text-lg leading-none">5BROSLEGO AI</h3>
                  <span className="text-xs text-yellow-100">Luôn sẵn sàng hỗ trợ</span>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)}><X size={20} /></button>
            </div>

            {/* Nội dung Chat */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50 space-y-4 max-h-[450px]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex flex-col ${msg.from === "user" ? "items-end" : "items-start"}`}>
                  
                  {/* Bong bóng tin nhắn */}
                  <div
                    className={`px-4 py-2 rounded-2xl text-sm max-w-[85%] shadow-sm whitespace-pre-line ${
                      msg.from === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>

                  {/* --- HIỂN THỊ SẢN PHẨM GỢI Ý --- */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="mt-2 w-[90%] grid grid-cols-1 gap-2">
                      <p className="text-xs text-gray-500 font-bold ml-1 uppercase">Sản phẩm đề xuất:</p>
                      {msg.products.map((product) => (
                        <Link 
                          key={product._id} 
                          to={`/product/${product._id}`} // Link tới trang chi tiết
                          className="flex bg-white p-2 rounded-lg border border-gray-200 hover:shadow-md hover:border-yellow-400 transition items-center gap-3 no-underline"
                          onClick={() => setIsOpen(false)} // Tự động đóng chat khi bấm xem
                        >
                          <div className="w-14 h-14 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                            <img 
                              src={product.image || "https://via.placeholder.com/150"} 
                              alt={product.name} 
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-bold text-gray-800 truncate">{product.name}</h4>
                            <p className="text-red-600 text-xs font-bold mt-1">
                              {product.price?.toLocaleString()}đ
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Loading indicator */}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-500 animate-pulse">
                    Đang soạn tin...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t p-3">
              <div className="flex gap-2 mb-2 overflow-x-auto scrollbar-hide">
                {quickReplies.map((text, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(text)}
                    className="whitespace-nowrap px-3 py-1 bg-gray-100 hover:bg-blue-50 text-blue-600 text-xs rounded-full border border-gray-200 transition"
                  >
                    {text}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2 relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-gray-100 text-sm rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="absolute right-1 top-1 bg-yellow-500 text-white p-1.5 rounded-full hover:bg-yellow-600 disabled:bg-gray-300 transition"
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