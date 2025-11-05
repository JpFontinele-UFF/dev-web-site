import { useQuery } from "@tanstack/react-query";
import type { Aluno } from "../interfaces/Aluno";

const API_URL = "/alunos";

const useRecuperarAlunos = () => {
  return useQuery<Aluno[], Error>({
    queryKey: ["alunos"],
    queryFn: async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          let bodyText = "";
          try {
            bodyText = await res.text();
          } catch {
            /* ignore */
          }
          throw new Error(`Failed to fetch alunos: ${res.status} ${res.statusText} ${bodyText}`);
        }
        // API returns { success, message, data }
        const json = await res.json();
        const data = json?.data ?? json;
        if (!Array.isArray(data)) {
          throw new Error(`Unexpected response shape, expected array but got: ${JSON.stringify(data)}`);
        }
        return data as Aluno[];
      } catch (err: unknown) {
        if (err instanceof Error) throw err;
        throw new Error(String(err));
      }
    },
    staleTime: 10_000,
  });
};

export default useRecuperarAlunos;
