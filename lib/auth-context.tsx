"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const session = localStorage.getItem("ticketapp_session");
    if (session) {
      try {
        const userData = JSON.parse(session);
        setUser(userData);
      } catch {
        localStorage.removeItem("ticketapp_session");
      }
    }
    setIsLoading(false);
  }, []);

  const mockUsers: Record<string, { password: string; name: string }> = {
    "test@example.com": { password: "password123", name: "Test User" },
    "demo@example.com": { password: "demo123", name: "Demo User" },
  };

  const getStoredUsers = (): User[] => {
    try {
      return JSON.parse(localStorage.getItem("ticketapp_users") || "[]");
    } catch {
      return [];
    }
  };

  const saveStoredUsers = (users: User[]) => {
    localStorage.setItem("ticketapp_users", JSON.stringify(users));
  };

  const login = async (email: string, password: string) => {
    if (!email || !password) throw new Error("Email and password are required");

    const mockUser = mockUsers[email];

    if (mockUser && mockUser.password === password) {
      const userData: User = {
        id: "mock-" + Math.random().toString(36).substring(2, 9),
        email,
        name: mockUser.name,
        password,
      };
      localStorage.setItem("ticketapp_session", JSON.stringify(userData));
      setUser(userData);
      return;
    }

    const users = getStoredUsers();
    const existingUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!existingUser) throw new Error("Invalid email or password");

    localStorage.setItem("ticketapp_session", JSON.stringify(existingUser));
    setUser(existingUser);
  };

  const signup = async (email: string, password: string, name: string) => {
    if (!email || !password || !name)
      throw new Error("All fields are required");

    const users = getStoredUsers();

    if (users.some((u) => u.email === email))
      throw new Error("User already exists. Please log in instead.");

    const newUser: User = {
      id: Math.random().toString(36).substring(2, 9),
      email,
      name,
      password,
    };

    const updatedUsers = [...users, newUser];
    saveStoredUsers(updatedUsers);

    // Automatically sign in after signup
    localStorage.setItem("ticketapp_session", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("ticketapp_session");
    setUser(null);
    // router.push("/");

    setTimeout(() => {
      router.push("/");
    }, 50);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
