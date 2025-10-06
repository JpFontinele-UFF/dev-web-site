import { useQuery } from "@tanstack/react-query";
import recuperarTurmas from "../util/recuperarTurmas";

const useRecuperarTurmas = () => {
  return useQuery({
    queryKey: ["turmas"],
    queryFn: () => Promise.resolve(recuperarTurmas().turmas),
    staleTime: 10_000,
  });
};
export default useRecuperarTurmas;
