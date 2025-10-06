import { useQuery } from "@tanstack/react-query";
import recuperarTurmas from "../util/recuperarTurmas";

const recuperarTurmaPorId = async (id: number) => {
  const { turmas } = recuperarTurmas();
  const t = turmas.find((x) => x.id === id);
  if (!t) throw new Error("Turma não encontrada: " + id);
  return t;
};

const useRecuperarTurmaPorId = (id: number) => {
  return useQuery({
    queryKey: ["turmas", id],
    queryFn: () => recuperarTurmaPorId(id),
    staleTime: 10_000,
  });
};
export default useRecuperarTurmaPorId;
