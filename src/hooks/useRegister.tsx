import { useState } from "react";
import { useAuth } from "../store/AuthContext";

type RegisterParams = { nome: string; email: string; password: string };

const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? "";
const API_REGISTER = API_BASE ? `${API_BASE.replace(/\/$/, "")}/auth/register` : "/auth/register";

export default function useRegister() {
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuth();

  async function register({ nome, email, password }: RegisterParams) {
    setLoading(true);
    console.debug("useRegister: API_REGISTER=", API_REGISTER, { nome, email });
    try {
      const res = await fetch(API_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, password }),
      });
      const text = await res.text();
      console.debug("useRegister: response status=", res.status, "text=", text);
      let json: any = {};
      try {
        json = JSON.parse(text);
      } catch {
        json = { message: text };
      }
      if (!res.ok) {
        // Se o servidor retornar erros de validação no formato { errors: { field: message } }
        if (json && typeof json === "object" && json.errors && typeof json.errors === "object") {
          const validation = json.errors;
          setLoading(false);
          const err: any = new Error(json.message || "Validation failed");
          err.validation = validation;
          err.status = res.status;
          throw err;
        }
        const msg = json?.message || text || `Register failed: ${res.status}`;
        setLoading(false);
        const err: any = new Error(msg);
        err.status = res.status;
        throw err;
      }
      setLoading(false);
      // se a API já retornar token após registro, armazena-o; caso contrário apenas retorna
      const token = json?.token ?? json?.accessToken ?? null;
      const roles = json?.roles ?? null;
      const nomeResp = json?.nome ?? json?.user?.nome ?? json?.name ?? null;
      const emailResp = json?.email ?? null;
      if (token) setAuth({ token, roles: roles ?? [], nome: nomeResp, email: emailResp });
      return json;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  }

  return { register, loading };
}
