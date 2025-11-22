"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { type User } from "firebase/auth";
import {
  onAuthStateChanged,
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  signOut,
} from "@/lib/firebase/auth";
import { createSession, removeSession } from "@/actions/auth-action";
import type { UserRole } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  userRole: UserRole | null;
  signInWithGoogle: () => Promise<User>;
  signInWithEmail: (email: string, password: string) => Promise<User>;
  signUpWithEmail: (
    email: string,
    password: string,
    name?: string
  ) => Promise<User>;
  signOut: () => Promise<void>;
  refreshUserRole: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within AuthContextProvider");
  return context;
};

export function AuthContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  // ➜ Only refresh role when needed
  const refreshUserRole = useCallback(async () => {
    if (user) {
      const idTokenResult = await user.getIdTokenResult();
      setUserRole((idTokenResult.claims.role as UserRole) || "user");
    }
  }, [user]);

  useEffect(() => {
    let initial = true;

    const unsubscribe = onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const idToken = await authUser.getIdToken();

        // ➜ Only create session the first time the user logs in
        if (initial) {
          await createSession(idToken);
        }

        setUser(authUser);

        const idTokenResult = await authUser.getIdTokenResult();
        setUserRole((idTokenResult.claims.role as UserRole) || "user");
      } else {
        await removeSession();
        setUser(null);
        setUserRole(null);
      }

      setLoading(false);
      initial = false;
    });

    return () => unsubscribe();
  }, []);

  // ➜ Final logout logic
  const handleSignOut = async () => {
    await signOut();
    await removeSession();
    setUser(null);
    setUserRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        userRole,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut: handleSignOut,
        refreshUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
