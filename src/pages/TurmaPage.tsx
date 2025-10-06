import { useParams } from "react-router-dom";
import useRecuperarTurmaPorId from "../hooks/useRecuperarTurmaPorId";

const TurmaPage = () => {
  const params = useParams();
  const id = Number(params.id ?? "0");
  const { data: turma, isLoading, error } = useRecuperarTurmaPorId(id);

  if (isLoading) return <div>Carregando turma...</div>;
  if (error) return <div>Erro ao carregar turma</div>;
  if (!turma) return <div>Turma não encontrada</div>;

  return (
    <div>
      <h2>Turma: {turma.disciplina.nome}</h2>
      <p>
        <strong>Ano:</strong> {turma.ano} <br />
        <strong>Período:</strong> {turma.periodo}
      </p>
      <p>
        <strong>Professor:</strong> {turma.professor.nome} ({turma.professor.email})
      </p>
      <h4>Alunos inscritos</h4>
      <ul className="list-group">
        {turma.inscricoes.map((i) => (
          <li key={i.id} className="list-group-item">
            {i.aluno.nome} — {i.aluno.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TurmaPage;
