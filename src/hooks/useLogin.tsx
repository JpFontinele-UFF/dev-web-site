import { useState } from "react";
import { useAuth } from "../store/AuthContext";

type LoginParams = { email: string; password: string };

const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? "";
const API_LOGIN = API_BASE ? `${API_BASE.replace(/\/$/, "")}/auth/login` : "/auth/login";

export default function useLogin() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();

  async function login({ email, password }: LoginParams) {
    setLoading(true);
    console.debug("useLogin: API_LOGIN=", API_LOGIN, { email });
    try {
      const res = await fetch(API_LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const text = await res.text();
      console.debug("useLogin: response status=", res.status, "text=", text);
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        json = { message: text };
      }
      if (!res.ok) {
        const msg = json?.message || text || `Login failed: ${res.status}`;
        throw new Error(msg);
      }

      // espera-se que a resposta contenha um token e informações do usuário/roles
      const token = json?.token ?? json?.accessToken ?? null;
      const roles = json?.roles ?? json?.authorities ?? json?.user?.roles ?? null;
      const nome = json?.nome ?? json?.user?.nome ?? json?.name ?? null;
      const emailResp = json?.email ?? json?.user?.email ?? null;
      if (token) {
        setAuth({ token, roles: roles ?? [], nome, email: emailResp });
      } else {
        console.warn("Login succeeded but no token returned by backend.");
      }
      setLoading(false);
      return { token, roles };
    } catch (err) {
      setLoading(false);
      throw err;
    }
  }

  return { login, loading };
}
