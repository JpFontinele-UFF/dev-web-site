import { useEffect, useMemo, useState } from "react";
import useRecuperarTurmas from "../hooks/useRecuperarTurmas";
import useRecuperarTurmaPorId from "../hooks/useRecuperarTurmaPorId";
import useRecuperarAlunos from "../hooks/useRecuperarAlunos";

interface TurmaParaDropdown {
  id: number;
  codigo?: string;
  ano?: number;
  periodo?: string;
  disciplina?: { nome: string };
}

const GerenciarAlunosPage = () => {

  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");

  const { data: turmas, isLoading: carregandoTurmas } = useRecuperarTurmas();

  const { isLoading: carregandoTodosAlunos } = useRecuperarAlunos();

  const turmaIdNumerico = Number(turmaSelecionada) || 0;
  
  const { data: turmaCompleta, isLoading: carregandoTurma } =
    useRecuperarTurmaPorId(turmaIdNumerico);

  const turmaCodigo = useMemo(() => {
    const t = turmaCompleta as any;
    if (!t) return null;
    return t.codigoTurma;
  }, [turmaCompleta]);

  const [grupoLocal, setGrupoLocal] = useState<number[]>([]);

  useEffect(() => {
    if (!turmaCodigo) {
      setGrupoLocal([]);
      return;
    }
    const raw = localStorage.getItem(String(turmaCodigo));
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      setGrupoLocal(Array.isArray(parsed) ? parsed : []);
    } catch {
      setGrupoLocal([]);
    }
  }, [turmaCodigo]);

  const salvarGrupoLocal = (novo: number[]) => {
    if (!turmaCodigo) return;
    localStorage.setItem(String(turmaCodigo), JSON.stringify(novo));
    setGrupoLocal(novo);
  };

  const estaNoGrupoLocal = (alunoId: number) => grupoLocal.includes(alunoId);

  const toggleGrupoLocal = (alunoId: number) => {
    if (!turmaCodigo) return;
    if (estaNoGrupoLocal(alunoId)) salvarGrupoLocal(grupoLocal.filter((x) => x !== alunoId));
    else salvarGrupoLocal([...grupoLocal, alunoId]);
  };

  if (carregandoTurmas) return <div>Carregando turmas...</div>;

  const isLoading = (!!turmaIdNumerico && carregandoTurma) || carregandoTodosAlunos;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gerenciar Alunos por Turma</h2>

      {/* Seleção de turma */}
      <div className="mb-4 d-flex align-items-center">
        <label className="form-label fw-bold me-2 mb-0">Turma:</label>
        <select
          className="form-select w-auto"
          value={turmaSelecionada}
          onChange={(e) => setTurmaSelecionada(e.target.value)}
        >
          <option value="">Selecione uma turma</option>
          {turmas?.map((t: TurmaParaDropdown) => {
            const codigoTurma = (t as any).codigoTurma ?? t.codigo ?? "";
            const disciplinaNome = t.disciplina?.nome ?? "";
            return (
              <option key={t.id} value={t.id}>
                {codigoTurma}{codigoTurma && disciplinaNome ? " — " : ""}{disciplinaNome} — {t.ano}/{t.periodo}
              </option>
            );
          })}
        </select>
      </div>

      {/* Tabela de alunos */}
      {isLoading ? (
        <div>Carregando alunos...</div>
      ) : (
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Ação</th>
            </tr>
          </thead>
          <tbody>
            {/* Se nenhuma turma selecionada, tbody vazio (apenas cabeçalho é mostrado) */}
            {!turmaIdNumerico
              ? null
              : (turmaCompleta?.inscricoes ?? []).map((insc: any) => {
                  const aluno = insc.aluno ?? {};
                  const id = aluno.id ?? 0;
                  const inGrupo = estaNoGrupoLocal(id);
                  return (
                    <tr key={insc.id}>
                      <td>{aluno.id}</td>
                      <td>{aluno.nome}</td>
                      <td>{aluno.email}</td>
                      <td>
                        <button
                          className={`btn btn-sm ${inGrupo ? "btn-danger" : "btn-primary"}`}
                          onClick={() => toggleGrupoLocal(id)}
                          disabled={!turmaIdNumerico}
                        >
                          {inGrupo ? "Remover" : "Incluir"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GerenciarAlunosPage;