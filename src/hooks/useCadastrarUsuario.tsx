import { useState } from "react";
import useFetchWithAuth from "./useFetchWithAuth";

type CadastrarUsuarioParams = { nome: string; email: string; password: string; role: string };

export default function useCadastrarUsuario() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fetchWithAuth = useFetchWithAuth();

  async function cadastrarUsuario({ nome, email, password, role }: CadastrarUsuarioParams) {
    setLoading(true);
    setError(null);
    console.debug("useCadastrarUsuario: cadastrando usuário", { nome, email, role });
    try {
      const API_BASE = (import.meta as any).env?.VITE_API_BASE ?? "";
      const API_URL = API_BASE ? `${API_BASE.replace(/\/$/, "")}/auth/admin/register` : "/auth/admin/register";

      const json = await fetchWithAuth(API_URL, {
        method: "POST",
        body: JSON.stringify({ nome, email, password, role }),
      });

      setLoading(false);
      return json;
    } catch (err: any) {
      setLoading(false);
      let mensagem = "Erro ao cadastrar usuário";
      
      if (err?.validation) {
        mensagem = Object.values(err.validation).join(", ");
      } else if (err?.message) {
        mensagem = err.message;
      }
      
      setError(mensagem);
      throw err;
    }
  }

  return { cadastrarUsuario, loading, error };
}
