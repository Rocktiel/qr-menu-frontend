"use client";

import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const decoded = jwtDecode(token);
      setUser(decoded);
    } catch (error) {
      console.error("Auth error:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = (token) => {
    localStorage.setItem("token", token);
    const decoded = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    logout,
    checkAuth,
  };
}
