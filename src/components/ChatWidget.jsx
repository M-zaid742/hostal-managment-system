import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X, MessageCircle, Phone, Share2 } from "lucide-react";
import { getUser } from "../utils/auth.js";

export default function ChatWidget({ hostelId, hostelName, hostelPhone, hostelOwnerName }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "hostel",
      text: `Hi! I'm ${hostelOwnerName}. How can I help you today?`,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const user = getUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      sender: user?.id || "guest",
      text: inputValue,
      timestamp: new Date()
    };

    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate response after delay
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: prev.length + 1,
        sender: "hostel",
        text: "Thank you for your message! We'll get back to you soon.",
        timestamp: new Date()
      }]);
      setIsLoading(false);
    }, 1000);
  };

  const handleCall = () => {
    if (hostelPhone) {
      window.location.href = `tel:${hostelPhone}`;
    }
  };

  const handleWhatsApp = () => {
    if (hostelPhone) {
      const whatsappUrl = `https://wa.me/${hostelPhone.replace(/\D/g, '')}?text=Hi, I'm interested in your hostel ${hostelName}`;
      window.open(whatsappUrl, "_blank");
    }
  };

  return (
    <>
      {/* Chat Widget Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-lg hover:shadow-xl flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageCircle size={24} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 w-96 max-h-[600px] bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl shadow-2xl border border-slate-700/30 backdrop-blur-xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-white font-bold">{hostelName}</h3>
                <p className="text-purple-100 text-sm">Chat with {hostelOwnerName}</p>
              </div>
              <motion.button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <X size={20} className="text-white" />
              </motion.button>
            </div>

            {/* Quick Actions */}
            <div className="border-b border-slate-700/30 px-4 py-3 flex gap-2">
              <motion.button
                onClick={handleCall}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-green-500/20 text-green-300 font-semibold hover:bg-green-500/30 transition-all text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Phone size={16} />
                Call
              </motion.button>
              <motion.button
                onClick={handleWhatsApp}
                className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/20 text-cyan-300 font-semibold hover:bg-cyan-500/30 transition-all text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={16} />
                WhatsApp
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${
                    message.sender === "hostel" ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "hostel"
                        ? "bg-slate-700/50 text-slate-100"
                        : "bg-purple-600 text-white"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-slate-700/50 px-4 py-2 rounded-lg">
                    <motion.div
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="text-sm text-slate-300"
                    >
                      Typing...
                    </motion.div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-700/30 p-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleSendMessage();
                  }}
                  className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 text-sm"
                />
                <motion.button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg transition-all disabled:opacity-50"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
