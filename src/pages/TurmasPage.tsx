import { Link } from "react-router-dom";
import useRecuperarTurmas from "../hooks/useRecuperarTurmas";

const TurmasPage = () => {
  const { data: turmas, isLoading, error } = useRecuperarTurmas();

  if (isLoading) return <div>Carregando turmas...</div>;
  if (error)
    return (
      <div>
        <h3>Erro ao carregar turmas</h3>
        <pre style={{ color: "red" }}>{String(error.message)}</pre>
      </div>
    );

  return (
    <div>
      <h2>Lista de Turmas</h2>
      <ul className="list-group">
        {turmas?.map((t) => {
          const codigoTurma = (t as any).codigoTurma ?? (t as any).codigo ?? "";
          const disciplinaNome = t.disciplina?.nome ?? (t as any).disciplinaNome ?? String((t as any).disciplina ?? t.id);
          return (
            <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{codigoTurma ? `${codigoTurma} — ${disciplinaNome}` : disciplinaNome}</strong>
                {` — ${t.ano} / ${t.periodo}`}
              </div>
              <div>
                <Link className="btn btn-sm btn-primary" to={`/turmas/${t.id}`}>
                  Ver turma
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
export default TurmasPage;
