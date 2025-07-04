// src/pages/AuthPage.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim()) {
      alert("Username required");
      return;
    }

    // ✅ You can add real auth logic here later
    localStorage.setItem("currentUser", username);
    navigate("/home");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {isLogin ? "Login" : "Register"}
        </button>

        <p className="mt-4 text-sm text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
