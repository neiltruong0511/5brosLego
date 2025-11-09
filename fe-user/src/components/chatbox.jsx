import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";
import { Link } from "react-router-dom";

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "👋 Xin chào! Mình là trợ lý LEGO AI — bạn muốn xem bộ LEGO nào nè?",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await axios.post("https://fivebroslego.onrender.com/api/chat", {
        message: input,
        history: messages.map((msg) => ({
          role: msg.from === "bot" ? "assistant" : "user",
          content: msg.text,
        })),
      });

      const { reply, products } = response.data;
      setMessages((prev) => [...prev, { from: "bot", text: reply }]);
      setSuggestedProducts(products || []);
    } catch (err) {
      console.error("Lỗi gửi tin nhắn:", err);
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "😅 Xin lỗi, hiện tại tôi đang gặp sự cố. Bạn thử lại nhé!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg z-50 hover:bg-blue-700"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-blue-600 text-white p-3 rounded-t-2xl font-semibold">
              💬 Trợ lý LEGO AI
            </div>

            <div className="flex-1 p-3 overflow-y-auto max-h-96 space-y-2">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
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
              {isLoading && (
                <div className="text-gray-400 text-xs italic">
                  Đang soạn phản hồi...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {suggestedProducts.length > 0 && (
              <div className="border-t border-gray-200 p-3 bg-gray-50">
                <div className="font-semibold text-sm mb-2 text-gray-600">
                  🧱 Gợi ý sản phẩm phù hợp:
                </div>
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
                          {p.price.toLocaleString()}đ
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

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
                onClick={sendMessage}
                className="ml-2 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Chatbox;
