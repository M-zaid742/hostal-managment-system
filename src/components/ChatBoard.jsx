import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Minimize2, Maximize2 } from 'lucide-react';

const chatResponses = {
  booking: 'To make a booking, search for your desired hostel, select your dates, and click "Book Now". Your reservation will be confirmed instantly!',
  prices: 'Our prices are competitive and updated daily. Filter by price range on the search page to find hostels within your budget.',
  payment: 'We accept all major credit cards, debit cards, and various payment methods. Your payment is secure and encrypted.',
  cancellation: 'Cancellations can be made up to 7 days before check-in for a full refund. Terms may vary by hostel.',
  features: 'RoomFlow offers verified reviews, instant booking, 24/7 support, and access to 1,200+ quality hostels worldwide.',
  support: 'Our support team is available 24/7 via chat, email, or phone. We typically respond within 1 hour.',
  default: 'Thank you for your question! Our team will get back to you shortly. You can also contact our support team at support@roomflow.com'
};

export default function ChatBoard() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { 
      id: 1, 
      text: 'Hi! Welcome to RoomFlow. How can I assist you today? (Tip: Click the X button in the top-right to close this chat)', 
      sender: 'bot', 
      timestamp: new Date() 
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };
    setMessages([...messages, userMessage]);

    // Generate bot response based on keywords
    setTimeout(() => {
      let response = chatResponses.default;
      const lowerInput = input.toLowerCase();

      if (lowerInput.includes('booking') || lowerInput.includes('reserve')) {
        response = chatResponses.booking;
      } else if (lowerInput.includes('price') || lowerInput.includes('cost') || lowerInput.includes('cheap')) {
        response = chatResponses.prices;
      } else if (lowerInput.includes('payment') || lowerInput.includes('pay')) {
        response = chatResponses.payment;
      } else if (lowerInput.includes('cancel')) {
        response = chatResponses.cancellation;
      } else if (lowerInput.includes('feature') || lowerInput.includes('roomflow')) {
        response = chatResponses.features;
      } else if (lowerInput.includes('support') || lowerInput.includes('help')) {
        response = chatResponses.support;
      }

      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }, 500);

    setInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-[9999] p-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/50 transition-shadow"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={`fixed bottom-6 right-6 z-[9999] w-96 ${isMinimized ? 'h-auto' : 'h-screen md:h-[600px]'} rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden`}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">RoomFlow Support</h3>
                <p className="text-sm text-indigo-100">We're here to help!</p>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-indigo-700/50 rounded-lg transition-colors"
                  title={isMinimized ? "Expand chat" : "Minimize chat"}
                  aria-label={isMinimized ? "Expand chat" : "Minimize chat"}
                >
                  {isMinimized ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-indigo-700/50 rounded-lg transition-colors"
                  title="Close chat (Click to hide)"
                  aria-label="Close chat"
                >
                  <X size={18} />
                </motion.button>
              </div>
            </div>

            {/* Messages Area */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-indigo-600 text-white rounded-br-none'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="border-t border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask us anything..."
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSendMessage}
                      className="p-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                    >
                      <Send size={18} />
                    </motion.button>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
