"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

type User = {
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("deadstock_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback((email: string) => {
    const userData = { email };
    localStorage.setItem("deadstock_user", JSON.stringify(userData));
    setUser(userData);
    router.push("/");
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("deadstock_user");
    setUser(null);
    router.push("/login");
  }, [router]);

  // Protection Logic: Redirect if trying to access protected routes
  useEffect(() => {
    const protectedRoutes = ["/upload", "/dashboard"];
    if (!loading && !user && protectedRoutes.includes(pathname)) {
      router.push("/login");
    }
  }, [user, loading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
