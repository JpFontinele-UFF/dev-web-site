import type { Turma } from "../interfaces/Turma";
import type { Aluno } from "../interfaces/Aluno";
import type { Professor } from "../interfaces/Professor";
import type { Disciplina } from "../interfaces/Disciplina";

const alunos: Aluno[] = [
  { id: 1, nome: "Ana Silva", email: "ana.silva@example.com" },
  { id: 2, nome: "Bruno Costa", email: "bruno.costa@example.com" },
  { id: 3, nome: "Carla Souza", email: "carla.souza@example.com" },
  { id: 4, nome: "Diego Lima", email: "diego.lima@example.com" },
];

const professores: Professor[] = [
  { id: 1, nome: "Prof. Marcos", email: "marcos@example.com" },
  { id: 2, nome: "Profa. Helena", email: "helena@example.com" },
];

const disciplinas: Disciplina[] = [
  { id: 1, nome: "Matemática", cargaHoraria: 60 },
  { id: 2, nome: "Física", cargaHoraria: 45 },
  { id: 3, nome: "Programação", cargaHoraria: 80 },
];

const turmas: Turma[] = [
  {
    id: 1,
    ano: 2024,
    periodo: "1º",
    disciplina: disciplinas[2],
    professor: professores[0],
    inscricoes: [
      { id: 1, aluno: alunos[0], dataHora: new Date(2024, 7, 10, 9, 0).toISOString() },
      { id: 2, aluno: alunos[1], dataHora: new Date(2024, 7, 11, 10, 30).toISOString() },
    ],
  },
  {
    id: 2,
    ano: 2024,
    periodo: "2º",
    disciplina: disciplinas[0],
    professor: professores[1],
    inscricoes: [
      { id: 3, aluno: alunos[2], dataHora: new Date(2024, 6, 15, 14, 0).toISOString() },
      { id: 4, aluno: alunos[3], dataHora: new Date(2024, 6, 16, 15, 30).toISOString() },
    ],
  },
];

const recuperarTurmas = () => {
  return { turmas, alunos };
};

export default recuperarTurmas;
