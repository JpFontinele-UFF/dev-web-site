import useRecuperarAlunos from "../hooks/useRecuperarAlunos";
import useApi from "../hooks/useApi";
import { useQueryClient } from "@tanstack/react-query";

const AlunosPage = () => {
    const { data: alunos, isLoading, error } = useRecuperarAlunos();
    const api = useApi()
    const qc = useQueryClient()

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
                    <li key={a.id} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{a.nome}</strong> — {a.email}
                            {a.cpf && <span> ({a.cpf})</span>}
                        </div>
                        <div>
                            <button className="btn btn-sm btn-danger" onClick={async () => {
                                if (!confirm('Confirmar remoção do aluno?')) return
                                try {
                                    await api.delete(`/alunos/${a.id}`)
                                    // refresh
                                    qc.invalidateQueries({ queryKey: ['alunos'] })
                                    alert('Aluno removido')
                                } catch (e: any) {
                                    alert('Erro ao remover: ' + (e?.message ?? String(e)))
                                }
                            }}>Remover</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default AlunosPage;