import { useQuery } from "@tanstack/react-query";
import type { Turma } from "../interfaces/Turma";

const API_URL = "/turmas";

const useRecuperarTurmas = () => {
  return useQuery<Turma[], Error>({
    queryKey: ["turmas"],
    queryFn: async () => {
      try {
        const res = await fetch(API_URL);
        if (!res.ok) {
          let bodyText = "";
          try {
            bodyText = await res.text();
          } catch {}
          throw new Error(`Failed to fetch turmas: ${res.status} ${res.statusText} ${bodyText}`);
        }
        const json = await res.json();
        const data = json?.data ?? json;
        if (!Array.isArray(data)) {
          throw new Error(`Unexpected response shape, expected array but got: ${JSON.stringify(data)}`);
        }
        return data as Turma[];
      } catch (err: unknown) {
        if (err instanceof Error) throw err;
        throw new Error(String(err));
      }
    },
    staleTime: 10_000,
  });
};

export default useRecuperarTurmas;
