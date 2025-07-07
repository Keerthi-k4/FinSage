// src/AuthContext.js
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("AuthContext: Loaded user from localStorage:", JSON.parse(storedUser));
    } else {
      console.log("AuthContext: No user found in localStorage.");
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    console.log("AuthContext: User logged in and saved to localStorage:", userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    console.log("AuthContext: User logged out and removed from localStorage.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
