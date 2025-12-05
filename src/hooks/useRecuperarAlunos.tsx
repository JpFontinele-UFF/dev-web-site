import { useQuery } from "@tanstack/react-query";
import type { Aluno } from "../interfaces/Aluno";
import useApi from './useApi'

const API_URL = "/alunos";

const useRecuperarAlunos = () => {
  const api = useApi()
  return useQuery<Aluno[], Error>({
    queryKey: ["alunos"],
    queryFn: async () => {
      const data = await api.get(API_URL)
      // some backends wrap response: { data: [...] }
      return (data?.data ?? data) as Aluno[]
    },
    staleTime: 10_000,
  });
};

export default useRecuperarAlunos;
