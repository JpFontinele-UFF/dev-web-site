
import { useState } from "react";
import Pesquisa from "../components/Pesquisa";
import Paginacao from "../components/Paginacao";
import useRecuperarTurmas from "../hooks/useRecuperarTurmas";
import useRecuperarTurmaPorId from "../hooks/useRecuperarTurmaPorId";

const TurmasPesquisaPage = () => {
  const [pesquisa, setPesquisa] = useState("");
  const [turmaSelecionada, setTurmaSelecionada] = useState<number | null>(null);
  const [pagina, setPagina] = useState(0);
  const alunosPorPagina = 5;

  const { data: turmas, isLoading: turmasLoading, error: turmasError } = useRecuperarTurmas();
  const { data: turma, isLoading: turmaLoading, error: turmaError } = useRecuperarTurmaPorId(turmaSelecionada ?? 0);

  // Filtra turmas pelo código da turma (codigoTurma ou id)
  const turmasFiltradas = pesquisa
    ? (turmas ?? []).filter(t => {
        const codigoTurma = ((t as any).codigoTurma ?? (t as any).codigo ?? "").toString();
        return codigoTurma.toLowerCase().includes(pesquisa.toLowerCase()) || String(t.id).toLowerCase().includes(pesquisa.toLowerCase());
      })
    : [];

  // Alunos paginados
  const inscricoes = turma?.inscricoes ?? [];
  const totalDePaginas = Math.ceil(inscricoes.length / alunosPorPagina);
  // Garante que a página nunca ultrapasse o total de páginas
  const paginaCorrigida = Math.max(0, Math.min(pagina, totalDePaginas - 1));
  const alunosPaginados = inscricoes.slice(paginaCorrigida * alunosPorPagina, (paginaCorrigida + 1) * alunosPorPagina);

  // Reset página ao trocar turma
  const handleSelecionarTurma = (id: number) => {
    setTurmaSelecionada(id);
    setPagina(0);
  };

  return (
    <div className="container mt-4">
      <Pesquisa tratarPesquisa={setPesquisa} />
      <div className="row">
        <div className="col-3">
          <h5>Turmas</h5>
          {turmasLoading && <div>Carregando turmas...</div>}
          {turmasError && <div>Erro ao carregar turmas</div>}
          <ul className="list-group">
            {turmasFiltradas.map(t => {
              const codigoTurma = ((t as any).codigoTurma ?? (t as any).codigo ?? "").toString();
              const nomeDisciplina = t.disciplina?.nome ?? t.id;
              return (
                <li
                  key={t.id}
                  className={`list-group-item${turmaSelecionada === t.id ? " active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelecionarTurma(t.id)}
                >
                  {codigoTurma ? `${codigoTurma} — ${nomeDisciplina}` : nomeDisciplina}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="col-9">
          {pesquisa === "" ? null : turmaSelecionada === null ? (
            <div className="mt-4">Selecione uma turma para ver os alunos.</div>
          ) : turmaLoading ? (
            <div>Carregando turma...</div>
          ) : turmaError ? (
            <div>Erro ao carregar turma</div>
          ) : turma && alunosPaginados.length === 0 ? (
            <div className="mt-4">Nenhum aluno inscrito nesta turma.</div>
          ) : turma ? (
            <div>
              <h5>
                Ano: {turma.ano} Período: {turma.periodo} {' '}
                {turma.codigoTurma ?? (turma as any).codigo ? (
                  <span>Cod: {turma.codigoTurma ?? (turma as any).codigo} — </span>
                ) : null}
                Disc: {turma.disciplina?.nome} Prof: {turma.professor?.nome}
              </h5>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>id</th>
                    <th>nome</th>
                    <th>email</th>
                    <th>cpf</th>
                  </tr>
                </thead>
                <tbody>
                  {alunosPaginados.map(i => (
                    <tr key={i.id}>
                      <td>{i.aluno?.id ?? "-"}</td>
                      <td>{i.aluno?.nome ?? "-"}</td>
                      <td>{i.aluno?.email ?? "-"}</td>
                      <td>{i.aluno?.cpf ?? "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Paginacao
                pagina={paginaCorrigida}
                totalDePaginas={totalDePaginas === 0 ? 1 : totalDePaginas}
                tratarPaginacao={setPagina}
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default TurmasPesquisaPage;
