"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

  const login = (username: string, password: string): boolean => {
    if (
      username === ADMIN_CREDENTIALS.username &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const user = { name: "Admin User", role: "Super Admin" };
      setIsLoggedIn(true);
      setAdminUser(user);
      localStorage.setItem("admin_auth", JSON.stringify(user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem("admin_auth");
  };

  if (!hydrated) return null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, adminUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
