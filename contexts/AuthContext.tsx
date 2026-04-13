"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { AuthUser } from "@/types/auth";
import { authenticate, saveAuthSession, getAuthSession, clearAuthSession } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window !== "undefined") {
      return getAuthSession();
    }
    return null;
  });

  const login = useCallback(async (username: string, password: string) => {
    const authenticatedUser = authenticate(username, password);
    if (!authenticatedUser) {
      return { success: false, error: "Invalid credentials. Please check your username and password." };
    }
    setUser(authenticatedUser);
    saveAuthSession(authenticatedUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearAuthSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: false,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
