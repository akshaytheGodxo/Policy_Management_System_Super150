"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { api, getCredentials, setCredentials, clearCredentials, type User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const creds = getCredentials();
    if (creds) {
      api.get<User>("/api/auth/me")
        .then((u) => {
          setUser(u);
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(u));
          }
        })
        .catch(() => {
          clearCredentials();
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<User> => {
    setCredentials(email, password);
    const u = await api.get<User>("/api/auth/me");
    setUser(u);
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(u));
    }
    return u;
  }, []);

  const logout = useCallback(() => {
    clearCredentials();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
