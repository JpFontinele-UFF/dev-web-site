import { Link } from "react-router-dom";
import useRecuperarTurmas from "../hooks/useRecuperarTurmas";

const TurmasPage = () => {
  const { data: turmas, isLoading, error } = useRecuperarTurmas();

  if (isLoading) return <div>Carregando turmas...</div>;
  if (error) return <div>Erro ao carregar turmas</div>;

  return (
    <div>
      <h2>Lista de Turmas</h2>
      <ul className="list-group">
        {turmas?.map((t) => (
          <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <strong>{t.disciplina.nome}</strong> — {t.ano} / {t.periodo}
            </div>
            <div>
              <Link className="btn btn-sm btn-primary" to={`/turmas/${t.id}`}>
                Ver turma
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default TurmasPage;
