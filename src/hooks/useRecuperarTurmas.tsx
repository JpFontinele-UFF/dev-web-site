import { useQuery } from "@tanstack/react-query";
import type { Turma } from "../interfaces/Turma";
import useApi from "./useApi";

const useRecuperarTurmas = () => {
  const { list } = useApi<Turma>("/turmas");
  return useQuery<Turma[], Error>({
    queryKey: ["turmas"],
    queryFn: async () => {
      const data = await list();
      if (!Array.isArray(data)) {
        throw new Error(`Unexpected response shape, expected array but got: ${JSON.stringify(data)}`);
      }
      return data as Turma[];
    },
    staleTime: 10_000,
  });
};

export default useRecuperarTurmas;
