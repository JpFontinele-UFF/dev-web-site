import { useQuery } from "@tanstack/react-query";
import recuperarTurmas from "../util/recuperarTurmas";

const useRecuperarAlunos = () => {
  return useQuery({
    queryKey: ["alunos"],
    queryFn: () => Promise.resolve(recuperarTurmas().alunos),
    staleTime: 10_000,
  });
};
export default useRecuperarAlunos;
