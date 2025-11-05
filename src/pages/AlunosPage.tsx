import useRecuperarAlunos from "../hooks/useRecuperarAlunos";

const AlunosPage = () => {
  const { data: alunos, isLoading, error } = useRecuperarAlunos();

  if (isLoading) return <div>Carregando alunos...</div>;
  if (error)
    return (
      <div>
        <h3>Erro ao carregar alunos</h3>
        <pre style={{ color: "red" }}>{String(error.message)}</pre>
      </div>
    );

  return (
    <div>
      <h2>Lista de Alunos</h2>
      <ul className="list-group">
        {alunos?.map((a) => (
          <li key={a.id} className="list-group-item">
            <strong>{a.nome}</strong> — {a.email}
            {"—"/* INCLUSÃO DO CPF */}
            {a.cpf && <span> ({a.cpf})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
};
export default AlunosPage;