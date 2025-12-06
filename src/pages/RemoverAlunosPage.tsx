import { useState } from "react";
import useRecuperarAlunos from "../hooks/useRecuperarAlunos";
import useRemoverAluno from "../hooks/useRemoverAluno";
import { useAuth } from "../store/AuthContext";

const RemoverAlunosPage = () => {
  const { auth } = useAuth();
  const { data: alunos, isLoading, error } = useRecuperarAlunos();
  const { mutateAsync: removerAluno, isPending } = useRemoverAluno();
  const [feedback, setFeedback] = useState<string | null>(null);

  const temPerfilAdmin = (auth?.roles ?? []).some((r) => r === "ADMIN" || r === "ROLE_ADMIN");

  const handleRemover = async (id: number, nome: string) => {
    setFeedback(null);
    const confirmar = window.confirm(`Deseja remover o aluno "${nome}"?`);
    if (!confirmar) return;
    try {
      await removerAluno(id);
      setFeedback(`Aluno "${nome}" removido com sucesso.`);
    } catch (err: any) {
      if (err?.status === 403) {
        setFeedback("Remoção não autorizada (403). Apenas ADMIN pode remover alunos.");
      } else {
        setFeedback(err?.message ?? "Erro ao remover aluno.");
      }
    }
  };

  if (isLoading) return <div className="container mt-4">Carregando alunos...</div>;
  if (error)
    return (
      <div className="container mt-4">
        <h3>Erro ao carregar alunos</h3>
        <pre style={{ color: "red" }}>{String(error.message)}</pre>
      </div>
    );

  return (
    <div className="container mt-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h2>Remover Alunos</h2>
        </div>
        <span className={`badge ${temPerfilAdmin ? "bg-success" : "bg-secondary"}`}>
          Perfil atual: {temPerfilAdmin ? "ADMIN" : "USER"}
        </span>
      </div>

      {feedback && <div className="alert alert-info">{feedback}</div>}

      <div className="card">
        <div className="card-body p-0">
          <table className="table mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>CPF</th>
                <th style={{ width: 140 }}></th>
              </tr>
            </thead>
            <tbody>
              {alunos?.map((a) => (
                <tr key={a.id}>
                  <td>{a.id}</td>
                  <td>{a.nome}</td>
                  <td>{a.email}</td>
                  <td>{a.cpf ?? "-"}</td>
                  <td>
                    <button
                      className="btn btn-outline-danger btn-sm"
                      onClick={() => handleRemover(a.id, a.nome)}
                      disabled={isPending}
                    >
                      {isPending ? "Removendo..." : "Remover"}
                    </button>
                  </td>
                </tr>
              ))}
              {!alunos?.length && (
                <tr>
                  <td colSpan={5} className="text-center py-3">Nenhum aluno cadastrado.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RemoverAlunosPage;
