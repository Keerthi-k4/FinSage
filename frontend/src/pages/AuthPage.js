// src/pages/AuthPage.js
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { AuthContext } from "../AuthContext";

export default function AuthPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      console.log("Decoded Google user:", decoded);

      const payload = {
        token: credentialResponse.credential,
      };

      const res = await axios.post("http://localhost:8000/auth/google", payload);

      login(res.data); // Save to context
      navigate("/home");
    } catch (err) {
      console.error("Google login failed:", err);
      alert("Google login failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded shadow w-80 text-center">
        <h2 className="text-xl font-bold mb-4">Login with Google</h2>

        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={() => {
            console.error("Login Failed");
            alert("Google login failed.");
          }}
        />

        <p className="mt-4 text-sm text-gray-600">
          Use your Google account to log in securely.
        </p>
      </div>
    </div>
  );
}
