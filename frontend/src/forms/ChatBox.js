import { useState } from "react";
import axios from "axios";

export default function ChatBox() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/chat-query", { query });
      setResponse(res.data.response);
    } catch (err) {
      console.error(err);
      alert("Chat query failed.");
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
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
          Ask
        </button>
      </form>
      {response && <div className="mt-4 text-gray-800">{response}</div>}
    </div>
  );
}
