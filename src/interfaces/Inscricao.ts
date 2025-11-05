import type { Aluno } from "./Aluno";

export interface Inscricao {
  id: number;
  aluno: Aluno;
  dataHora: string; 
}
