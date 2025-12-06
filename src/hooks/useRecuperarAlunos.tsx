import { useQuery } from "@tanstack/react-query";
import type { Aluno } from "../interfaces/Aluno";
import useApi from "./useApi";

const useRecuperarAlunos = () => {
  const { list } = useApi<Aluno>("/alunos");
  return useQuery<Aluno[], Error>({
    queryKey: ["alunos"],
    queryFn: async () => {
      const data = await list();
      if (!Array.isArray(data)) {
        throw new Error(`Unexpected response shape, expected array but got: ${JSON.stringify(data)}`);
      }
      return data as Aluno[];
    },
    staleTime: 10_000,
  });
};

export default useRecuperarAlunos;
