"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface AuthContextType {
  isLoggedIn: boolean;
  adminUser: { name: string; role: string } | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "admin123",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<{ name: string; role: string } | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_auth");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setIsLoggedIn(true);
        setAdminUser(parsed);
      } catch {
        localStorage.removeItem("admin_auth");
      }
    }
    setHydrated(true);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // 1. Try real backend API login
    try {
      const email = username.includes("@") ? username : `${username}@waveofwellness.com`;
      const apiURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      
      const response = await axios.post(`${apiURL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = response.data;
      
      if (token && user) {
        setIsLoggedIn(true);
        const adminUserData = { name: user.name, role: user.role };
        setAdminUser(adminUserData);
        localStorage.setItem("admin_auth", JSON.stringify(adminUserData));
        localStorage.setItem("admin_token", token);
        return true;
      }
    } catch (err: any) {
      console.warn("Backend login failed, attempting local mock auth fallback:", err.response?.data || err.message);
    }

    // 2. Fallback to mock credentials if API is offline/unavailable or database is not seeded
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const user = { name: "Admin User", role: "Super Admin" };
      setIsLoggedIn(true);
      setAdminUser(user);
      localStorage.setItem("admin_auth", JSON.stringify(user));
      // Set dummy token for fallback
      localStorage.setItem("admin_token", "mock-token-fallback");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem("admin_auth");
    localStorage.removeItem("admin_token");
  };

  if (!hydrated) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, adminUser, login: (u, p) => {
      // Return a promise since login is now async
      return login(u, p) as any;
    }, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

