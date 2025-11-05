import type { Disciplina } from "./Disciplina";
import type { Professor } from "./Professor";
import type { Aluno } from "./Aluno";
export interface Turma {
  id: number;
  codigoTurma?: string;
  ano: number;
  periodo: string;
  disciplina: Disciplina;
  professor: Professor;
  inscricoes: {
    id: number;
    aluno: Aluno;
    dataHora: string;
  }[];
}
