import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../AuthContext";

export default function ChatBox() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse("");

    try {
      const payload = { query };

      // ✅ Correct user ID field
      if (user?.user_id) {
        payload.user_id = user.user_id;
      }

      const res = await axios.post("http://localhost:8000/chat-query", payload);
      setResponse(res.data.response || "No response received.");
    } catch (err) {
      console.error(err);
      alert("Chat query failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 bg-white rounded shadow">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask something..."
          className="w-full p-2 mb-4 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Ask"}
        </button>
      </form>

      {response && (
        <div className="mt-4 p-3 bg-gray-100 rounded text-gray-800 whitespace-pre-wrap">
          {response}
        </div>
      )}
    </div>
  );
}
