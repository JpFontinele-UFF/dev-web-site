import { useParams } from "react-router-dom";
import useRecuperarTurmaPorId from "../hooks/useRecuperarTurmaPorId";

const TurmaPage = () => {
    const params = useParams();
    const id = Number(params.id ?? "0");
    const { data: turma, isLoading, error } = useRecuperarTurmaPorId(id);

    if (isLoading) return <div>Carregando turma...</div>;
    if (error) return <div>Erro ao carregar turma</div>;
    if (!turma) return <div>Turma não encontrada</div>;

    const disciplinaNome = turma.disciplina?.nome ?? (turma as any).disciplinaNome ?? "";
    const codigoTurma = turma.codigoTurma ?? (turma as any).codigo ?? "";
    const professorNome = turma.professor?.nome ?? (turma as any).professorNome ?? "";
    const professorEmail = turma.professor?.email ?? (turma as any).professorEmail ?? "";

    return (
        <div>
            <h2>Turma: {codigoTurma ? `${codigoTurma} — ${disciplinaNome}` : disciplinaNome}</h2>
            <p>
                <strong>Ano:</strong> {turma.ano} <br />
                <strong>Período:</strong> {turma.periodo}
            </p>
            <p>
                <strong>Professor:</strong>{' '}
                {professorNome || professorEmail ? (
                    <>
                        {professorNome}
                        {professorEmail ? ` — ${professorEmail}` : ''}
                    </>
                ) : (
                    <span>Não informado</span>
                )}
            </p>
            <h4>Alunos inscritos</h4>
            <ul className="list-group">
                {(turma.inscricoes ?? []).map((i) => {
                    const aluno = (i as any).aluno ?? (i as any);

                    if (!aluno) return null;

                    const nome = aluno.nome ?? "-";
                    const email = aluno.email ?? "-";
                    const cpf = aluno.cpf ?? "-";

                    return (
                        <li key={aluno.id || i.id} className="list-group-item">

                            {nome} — {email} — {cpf}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default TurmaPage;