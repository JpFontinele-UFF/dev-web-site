import { useQuery } from "@tanstack/react-query";
import type { Turma } from "../interfaces/Turma";
import useApi from "./useApi";

const mapTurma = (data: any): Turma => {
  if (data.disciplinaNome || data.professorNome || data.alunos) {
    return {
      codigoTurma: data.codigoTurma ?? data.codigo ?? undefined,
      id: data.id,
      ano: data.ano,
      periodo: data.periodo,
      disciplina: {
        id: data.disciplinaId ?? 0,
        nome: data.disciplinaNome ?? "",
      },
      professor: {
        id: data.professorId ?? 0,
        nome: data.professorNome ?? "",
        email: data.professorEmail ?? "",
      },
      inscricoes: Array.isArray(data.alunos)
        ? data.alunos.map((a: any, idx: number) => ({
            id: a.inscricaoId ?? idx,
            aluno: {
              id: a.id,
              nome: a.nome,
              email: a.email,
              cpf: typeof a.cpf === "string" && a.cpf.length > 0 ? a.cpf : "-",
              inscricaoId: a.inscricaoId,
            },
            dataHora: new Date().toISOString(),
          }))
        : [],
    } as Turma;
  }

  if (Array.isArray(data.inscricoes)) {
    data.inscricoes = data.inscricoes.map((i: any) => ({
      ...i,
      aluno: {
        ...i.aluno,
        cpf: typeof i.aluno?.cpf === "string" && i.aluno?.cpf.length > 0 ? i.aluno.cpf : "-",
      },
    }));
  }

  return data as Turma;
};

const useRecuperarTurmaPorId = (id: number) => {
  const { getById } = useApi<Turma>("/turmas");

  return useQuery<Turma, Error>({
    queryKey: ["turmas", id],
    queryFn: async () => {
      if (!id) throw new Error("id inválido");
      const data = await getById(id);
      if (!data) throw new Error(`Turma não encontrada: ${id}`);
      return mapTurma(data);
    },
    staleTime: 10_000,
  });
};

export default useRecuperarTurmaPorId;