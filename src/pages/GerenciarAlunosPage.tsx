import { useState, useMemo } from "react";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import useRecuperarTurmas from "../hooks/useRecuperarTurmas";
import useRecuperarTurmaPorId from "../hooks/useRecuperarTurmaPorId";
import useRecuperarAlunos from "../hooks/useRecuperarAlunos";

// Tipagem do aluno
interface Aluno {
  id: number;
  nome: string;
  email: string;
}

// Tipagem da turma (para o dropdown)
interface TurmaParaDropdown {
  id: number;
  codigo?: string;
  ano?: number;
  periodo?: string;
  disciplina?: { nome: string };
}

// --- Funções de Mutação ---

// Chama POST /inscricoes
const matricularAluno = async ({
  turmaId,
  alunoId,
}: {
  turmaId: number;
  alunoId: number;
}) => {
  const res = await fetch("/inscricoes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ alunoId, turmaId }),
  });
  if (!res.ok) {
    const erro = await res.json();
    throw new Error(erro.message || "Falha ao matricular aluno");
  }
  return res.json();
};

// Chama DELETE /inscricoes/{id_da_inscricao}
const desmatricularAluno = async ({
  inscricaoId,
}: {
  inscricaoId: number;
}) => {
  const res = await fetch(`/inscricoes/${inscricaoId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const erro = await res.json();
    throw new Error(erro.message || "Falha ao desmatricular aluno");
  }
  return res.json();
};

// --- Componente Principal ---

const GerenciarAlunosPage = () => {
  const queryClient = useQueryClient();

  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("");

  // 1. Busca de turmas para o dropdown
  const { data: turmas, isLoading: carregandoTurmas } = useRecuperarTurmas();

  // 2. Busca TODOS OS ALUNOS do sistema
  const { data: todosAlunos = [], isLoading: carregandoTodosAlunos } =
    useRecuperarAlunos();

  // 3. Busca a TURMA SELECIONADA
  const turmaIdNumerico = Number(turmaSelecionada) || 0;
  
  // 'turmaCompleta' é o DTO da turma, mapeado pelo hook
  const { data: turmaCompleta, isLoading: carregandoTurma } =
    useRecuperarTurmaPorId(turmaIdNumerico);

  // 4. Cria um Map de Alunos Inscritos: Map<alunoId, inscricaoId>
  const alunosInscritosMap = useMemo(() => {
    const map = new Map<number, number>();

    // O hook mapeia 'data.alunos' para a propriedade 'inscricoes'
    const inscricoes = (turmaCompleta as any)?.inscricoes ?? [];

    // O hook (agora corrigido) coloca o inscricaoId no 'inscricao.id'
    for (const inscricao of inscricoes as any[]) {
      const alunoId = inscricao.aluno?.id;
      const inscricaoId = inscricao.id; // Este 'id' é o ID da inscrição
      
      if (alunoId && inscricaoId) {
        map.set(alunoId, inscricaoId);
      }
    }
    return map;
  }, [turmaCompleta]);

  // 5. Configura as MUTAÇÕES
  const invalidarTurmaQuery = () => {
    //
    // 👇 AQUI ESTÁ A CORREÇÃO DA QUERYKEY
    // Usa a chave correta ["turmas", id] que vimos no hook
    //
    queryClient.invalidateQueries({
      queryKey: ["turmas", turmaIdNumerico],
    });
  };

  const incluirMutation = useMutation({
    mutationFn: matricularAluno,
    onSuccess: invalidarTurmaQuery, // Agora vai recarregar os dados
    onError: (err) => alert(`Erro ao incluir: ${err.message}`),
  });

  const removerMutation = useMutation({
    mutationFn: desmatricularAluno,
    onSuccess: invalidarTurmaQuery, // Agora vai recarregar os dados
    onError: (err) => alert(`Erro ao remover: ${err.message}`),
  });

  // --- Handlers dos Botões ---
  const handleIncluir = (alunoId: number) => {
    if (!turmaIdNumerico) return;
    incluirMutation.mutate({ turmaId: turmaIdNumerico, alunoId });
  };

  const handleRemover = (alunoId: number) => {
    const inscricaoId = alunosInscritosMap.get(alunoId);
    if (!inscricaoId) {
      console.error("Não foi possível encontrar o ID da inscrição para remover.");
      return;
    }
    removerMutation.mutate({ inscricaoId });
  };

  // --- Renderização ---
  if (carregandoTurmas) return <div>Carregando turmas...</div>;

  const isLoading =
    (!!turmaIdNumerico && carregandoTurma) || carregandoTodosAlunos;
  const isMutating = incluirMutation.isPending || removerMutation.isPending;

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
          {turmas?.map((t: TurmaParaDropdown) => (
            <option key={t.id} value={t.id}>
              {t.codigo || t.disciplina?.nome} — {t.ano}/{t.periodo}
            </option>
          ))}
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
            {todosAlunos.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center">
                  Nenhum aluno encontrado no sistema.
                </td>
              </tr>
            ) : (
              todosAlunos.map((aluno) => {
                // 'estaNaTurma' agora deve funcionar
                const estaNaTurma =
                  !!turmaIdNumerico && alunosInscritosMap.has(aluno.id);

                return (
                  <tr key={aluno.id}>
                    <td>{aluno.id}</td>
                    <td>{aluno.nome}</td>
                    <td>{aluno.email}</td>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          estaNaTurma ? "btn-danger" : "btn-success"
                        }`}
                        onClick={() =>
                          estaNaTurma
                            ? handleRemover(aluno.id)
                            : handleIncluir(aluno.id)
                        }
                        disabled={!turmaIdNumerico || isMutating}
                      >
                        {isMutating
                          ? "..."
                          : estaNaTurma
                          ? "Remover"
                          : "Incluir"}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default GerenciarAlunosPage;