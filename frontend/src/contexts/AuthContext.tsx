import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthUser } from '../types/db';

interface AuthContextType {
  user: AuthUser | null;
  login: (user: AuthUser, stayLoggedIn?: boolean) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'luidcentral_session';
const PERSIST_KEY = 'luidcentral_persist';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    // On mount, check localStorage first (persistent), then sessionStorage
    const persisted = localStorage.getItem(PERSIST_KEY);
    if (persisted) {
      try {
        const parsed = JSON.parse(persisted) as AuthUser;
        setUser(parsed);
        return;
      } catch {
        localStorage.removeItem(PERSIST_KEY);
      }
    }
    const session = sessionStorage.getItem(SESSION_KEY);
    if (session) {
      try {
        const parsed = JSON.parse(session) as AuthUser;
        setUser(parsed);
      } catch {
        sessionStorage.removeItem(SESSION_KEY);
      }
    }
  }, []);

  const login = (authUser: AuthUser, stayLoggedIn = false) => {
    setUser(authUser);
    if (stayLoggedIn) {
      localStorage.setItem(PERSIST_KEY, JSON.stringify(authUser));
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
      localStorage.removeItem(PERSIST_KEY);
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(PERSIST_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
