import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";
import { motion } from "framer-motion";

export default function ChatBox() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const newUserMessage = { text: query, sender: "user" };
    setMessages((prev) => [...prev, newUserMessage]);
    setLoading(true);

    try {
      const payload = { query };
      if (user?.id) payload.user_id = user.id;

      const res = await axios.post("http://localhost:8000/chat-query", payload);
      const botResponse = res.data.response || "No response received.";

      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Something went wrong. Please try again.", sender: "bot" },
      ]);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <div className="flex flex-col h-[80vh] max-w-md mx-auto mt-6 p-4 bg-white rounded-3xl shadow-xl">
      <h2 className="text-2xl font-bold text-center mb-4 text-indigo-600">💬 Sage Assistant</h2>

      <div
        className="flex-1 overflow-y-auto px-2 py-4 bg-gray-50 rounded-xl mb-4"
        style={{ scrollBehavior: "smooth" }}
        id="chat-scroll"
      >
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex mb-3 ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl shadow text-sm max-w-[70%] ${
                msg.sender === "user"
                  ? "bg-gradient-to-br from-green-400 to-green-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start mb-3"
          >
            <div className="px-4 py-2 rounded-2xl shadow text-sm bg-gray-200 text-gray-500">
              Typing...
            </div>
          </motion.div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
