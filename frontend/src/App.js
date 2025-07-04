// App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import AuthPage from "./pages/AuthPage";        // 👈 New
import Home from "./pages/Home";
import UserPage from "./pages/UserPage";
import TransactionPage from "./pages/TransactionPage";
import SummaryPage from "./pages/SummaryPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />           {/* 👈 Default route */}
        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/users"
          element={
            <>
              <Navbar />
              <UserPage />
            </>
          }
        />
        <Route
          path="/transactions"
          element={
            <>
              <Navbar />
              <TransactionPage />
            </>
          }
        />
        <Route
          path="/summary"
          element={
            <>
              <Navbar />
              <SummaryPage />
            </>
          }
        />
        <Route
          path="/chat"
          element={
            <>
              <Navbar />
              <ChatPage />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
