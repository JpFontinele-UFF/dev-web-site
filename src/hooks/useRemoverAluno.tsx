import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Aluno } from "../interfaces/Aluno";
import useApi from "./useApi";

const useRemoverAluno = () => {
  const qc = useQueryClient();
  const { remove } = useApi<Aluno>("/alunos");

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["alunos"] });
      qc.invalidateQueries({ queryKey: ["turmas"] });
    },
  });
};

export default useRemoverAluno;
