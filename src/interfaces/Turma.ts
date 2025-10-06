import type { Disciplina } from "./Disciplina";
import type { Professor } from "./Professor";
export interface Turma {
  id: number;
  ano: number;
  periodo: string;
  disciplina: Disciplina;
  professor: Professor;
  inscricoes: {
    id: number;
    aluno: { id: number; nome: string; email: string };
    dataHora: string;
  }[];
}
