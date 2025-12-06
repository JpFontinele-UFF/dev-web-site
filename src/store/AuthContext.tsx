import React, { createContext, useContext, useEffect, useState } from "react";

type AuthState = {
  token: string | null;
  roles: string[];
  nome?: string | null;
  email?: string | null;
};

type AuthContextType = {
  auth: AuthState;
  setAuth: (a: AuthState) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [auth, setAuthState] = useState<AuthState>({ token: null, roles: [] });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const roles = localStorage.getItem("authRoles");
    const nome = localStorage.getItem("authName");
    const email = localStorage.getItem("authEmail");
    try {
      setAuthState({ token, roles: roles ? JSON.parse(roles) : [], nome, email });
    } catch {
      setAuthState({ token, roles: [], nome, email });
    }
  }, []);

  function setAuth(a: AuthState) {
    setAuthState(a);
    if (a.token) {
      localStorage.setItem("authToken", a.token);
    } else {
      localStorage.removeItem("authToken");
    }
    if (a.roles) {
      localStorage.setItem("authRoles", JSON.stringify(a.roles));
    } else {
      localStorage.removeItem("authRoles");
    }
    if (a.nome) {
      localStorage.setItem("authName", a.nome);
    } else {
      localStorage.removeItem("authName");
    }
    if (a.email) {
      localStorage.setItem("authEmail", a.email);
    } else {
      localStorage.removeItem("authEmail");
    }
  }

  function logout() {
    setAuthState({ token: null, roles: [] });
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRoles");
    localStorage.removeItem("authEmail");
  }

  return <AuthContext.Provider value={{ auth, setAuth, logout }}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
