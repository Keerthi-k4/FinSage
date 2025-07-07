import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../AuthContext";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting form...");
    console.log("isLogin:", isLogin);
    console.log("Email:", email);
    console.log("Name:", name);
    console.log("Password:", password);

    try {
      const url = isLogin
        ? "http://localhost:8000/users/login"
        : "http://localhost:8000/users/register";

      const payload = isLogin ? { email, password } : { name, email, password };

      console.log("Request URL:", url);
      console.log("Payload:", payload);

      const res = await axios.post(url, payload);

      console.log("Response received:", res.data);

      // ⚡ Save user to context
      login(res.data);

      console.log("User logged in and context updated. Navigating to /home...");
      navigate("/home");
    } catch (err) {
      console.error("Auth error:", err);
      console.error("Error details:", err.response?.data || err);
      alert(err.response?.data?.detail || "Authentication failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow w-80">
        <h2 className="text-xl font-bold mb-4 text-center">
          {isLogin ? "Login" : "Register"}
        </h2>

        {!isLogin && (
          <>
            <label className="text-sm font-semibold">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                console.log("Name changed:", e.target.value);
              }}
              placeholder="Your name"
              className="w-full p-2 mb-3 border rounded"
              required
            />
          </>
        )}

        <label className="text-sm font-semibold">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            console.log("Email changed:", e.target.value);
          }}
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          required
        />

        <label className="text-sm font-semibold">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            console.log("Password changed:", e.target.value);
          }}
          placeholder="Password"
          className="w-full p-2 mb-4 border rounded"
          required
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
            onClick={() => {
              setIsLogin(!isLogin);
              console.log("Switched mode. isLogin:", !isLogin);
            }}
            className="text-blue-600 underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}
