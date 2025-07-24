// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

import Navbar from "./components/Navbar";

import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import TransactionPage from "./pages/TransactionPage";
import SummaryPage from "./pages/SummaryPage";
import ChatPage from "./pages/ChatPage";
import ReceiptPage from "./pages/ReceiptPage"; // ✅ Added import
import { Toaster } from "react-hot-toast";

function ProtectedLayout() {
  const { user } = useContext(AuthContext);
  return user ? (
    <>
      <Toaster position="top-right" /> {/* ⬅️ required */}
      <Navbar />
      <Outlet />
    </>
  ) : (
    <Navigate to="/" />
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public login route */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected layout wrapper */}
        <Route element={<ProtectedLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/transactions" element={<TransactionPage />} />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/receipt" element={<ReceiptPage />} /> {/* ✅ Added route */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
