// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

import Navbar from "./components/Navbar";

import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import TransactionPage from "./pages/TransactionPage";
import SummaryPage from "./pages/SummaryPage";
import ChatPage from "./pages/ChatPage";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <Router>
      <Routes>
        {/* Default route: login/register */}
        <Route path="/" element={<AuthPage />} />

        {/* Protected routes */}
        <Route
          path="/home"
          element={
            user ? (
              <>
                <Navbar />
                <Home />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/transactions"
          element={
            user ? (
              <>
                <Navbar />
                <TransactionPage />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/summary"
          element={
            user ? (
              <>
                <Navbar />
                <SummaryPage />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/chat"
          element={
            user ? (
              <>
                <Navbar />
                <ChatPage />
              </>
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
