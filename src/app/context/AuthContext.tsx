"use client";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { AuthUser, Role } from "@/types/saas";
import * as authService from "@/services/auth";
import type { RegisterPayload } from "@/services/auth";

const STORAGE_KEY = "afrohub:user";

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean; // false until localStorage has been read
  signIn: (email: string, password: string) => Promise<AuthUser>;
  register: (payload: RegisterPayload) => Promise<AuthUser>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const homeFor = (role: Role) =>
  role === "super_admin" ? "/admin/super" : "/admin/business";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw));
    } catch {
      /* storage unavailable — stay signed out */
    }
    setReady(true);
  }, []);

  const persist = (u: AuthUser | null) => {
    setUser(u);
    try {
      if (u) localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  const signIn = useCallback(async (email: string, password: string) => {
    const u = await authService.login(email, password);
    persist(u);
    return u;
  }, []);

  const register = useCallback(async (payload: RegisterPayload) => {
    const u = await authService.registerBusiness(payload);
    persist(u);
    return u;
  }, []);

  const signOut = useCallback(() => persist(null), []);

  return (
    <AuthContext.Provider value={{ user, ready, signIn, register, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
