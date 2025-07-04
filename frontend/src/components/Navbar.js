import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">💰 Finsage</h1>
        <div className="space-x-4">
          <Link to="/home" className="hover:underline">Home</Link>
          <Link to="/transactions" className="hover:underline">Transactions</Link>
          <Link to="/summary" className="hover:underline">Summary</Link>
          <Link to="/chat" className="hover:underline">Chat</Link>
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="font-semibold">Hi, {user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
