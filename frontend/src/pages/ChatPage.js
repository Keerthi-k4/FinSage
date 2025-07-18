import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

export default function ChatBox() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]); // Chat history
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { role: "user", content: query };
    setMessages((prev) => [...prev, userMessage]);
    setQuery("");
    setLoading(true);

    try {
      const payload = { query };
      if (user?.user_id) {
        payload.user_id = user.user_id;
      }

      const res = await axios.post("http://localhost:8000/chat-query", payload);
      const botResponse = res.data.response || "No response received.";
      setMessages((prev) => [...prev, { role: "assistant", content: botResponse }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Chat query failed." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl h-[80vh] bg-white shadow-2xl rounded-xl flex flex-col overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="bg-green-600 text-white text-lg font-semibold px-6 py-3">
          💬 FinSage AI Assistant
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gray-50">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-sm ${
                  msg.role === "user"
                    ? "bg-green-500 text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-300 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 bg-white border border-gray-300 text-gray-500 rounded-lg rounded-bl-none animate-pulse">
                Typing...
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-gray-200 bg-white flex items-center gap-3"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-400 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
