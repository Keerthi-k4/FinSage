import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">💰 Finsage</h1>
        <div className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/users" className="hover:underline">Users</Link>
          <Link to="/transactions" className="hover:underline">Transactions</Link>
          <Link to="/summary" className="hover:underline">Summary</Link>
          <Link to="/chat" className="hover:underline">Chat</Link>
        </div>
      </div>
    </nav>
  );
}
