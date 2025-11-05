import { useQuery } from "@tanstack/react-query";
import type { Turma } from "../interfaces/Turma";

const API_BASE = "/turmas";

const recuperarTurmaPorId = async (id: number) => {
  try {
    const res = await fetch(`${API_BASE}/${id}`);
    if (!res.ok) {
      let body = "";
      try {
        body = await res.text();
      } catch {}
      throw new Error(
        `Failed to fetch turma ${id}: ${res.status} ${res.statusText} ${body}`
      );
    }
    const json = await res.json();
    let data = json?.data ?? json;
    if (!data) throw new Error(`Turma não encontrada: ${id}`);

    // If backend returns flat fields (disciplinaNome, professorNome, alunos),
    // map them into the application's expected Turma shape.
    if (data.disciplinaNome || data.professorNome || data.alunos) {
      const mapped = {
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
              //
              // 👇 AQUI ESTÁ A CORREÇÃO NO HOOK
              // O 'id' da inscrição é o 'a.inscricaoId' do DTO
              //
              id: a.inscricaoId ?? idx, // ANTES: a.id ?? idx
              aluno: {
                id: a.id,
                nome: a.nome,
                email: a.email,
                cpf:
                  typeof a.cpf === "string" && a.cpf.length > 0 ? a.cpf : "-",
                // Passa o inscricaoId para frente
                inscricaoId: a.inscricaoId, 
              },
              dataHora: new Date().toISOString(),
            }))
          : [],
      } as Turma;
      return mapped;
    }

    // Garante que o campo cpf exista em cada aluno, mesmo no retorno padrão
    if (Array.isArray(data.inscricoes)) {
      data.inscricoes = data.inscricoes.map((i: any) => ({
        ...i,
        aluno: {
          ...i.aluno,
          cpf:
            typeof i.aluno?.cpf === "string" && i.aluno?.cpf.length > 0
              ? i.aluno.cpf
              : "-",
        },
      }));
    }
    return data as Turma;
  } catch (err: unknown) {
    if (err instanceof Error) throw err;
    throw new Error(String(err));
  }
};

const useRecuperarTurmaPorId = (id: number) => {
  return useQuery<Turma, Error>({
    // A chave correta é ["turmas", id]
    queryKey: ["turmas", id],
    queryFn: () => recuperarTurmaPorId(id),
    staleTime: 10_000,
  });
};

export default useRecuperarTurmaPorId;