import useRecuperarTurmaPorId from '../../hooks/useRecuperarTurmaPorId'
import useInscricaoStore from '../../store/useInscricaoStore'
import Paginacao from '../Paginacao'
import { useEffect, useMemo } from 'react'

const TabelaDeAlunosPorTurma = () => {
  const turmaId = useInscricaoStore((s) => s.turmaId)
  const pesquisa = useInscricaoStore((s) => s.pesquisa)
  const { data: turma, isLoading } = useRecuperarTurmaPorId(turmaId ?? 0)

  const inscricoes = turma?.inscricoes ?? []

  // ordena desc por id da inscricao
  const ordenadas = [...inscricoes].sort((a, b) => (b.id ?? 0) - (a.id ?? 0))

  const filtradas = useMemo(() =>
    (pesquisa
      ? ordenadas.filter((i) => i.aluno.nome.toLowerCase().includes(pesquisa.toLowerCase()))
      : ordenadas
    ), [ordenadas, pesquisa])

  const pagina = useInscricaoStore((s) => s.pagina)
  const setPagina = useInscricaoStore((s) => s.setPagina)
  const PAGE_SIZE = 5

  // reset pagina quando turma ou pesquisa mudar
  useEffect(() => {
    setPagina(0)
  }, [turmaId, pesquisa, setPagina])

  const totalDePaginas = Math.max(1, Math.ceil(filtradas.length / PAGE_SIZE))
  const inicio = pagina * PAGE_SIZE
  const atual = filtradas.slice(inicio, inicio + PAGE_SIZE)

  if (!turmaId) return <div className="alert alert-secondary">Selecione uma disciplina e turma</div>
  if (isLoading) return <div>Carregando inscritos...</div>

  const total = inscricoes.length

  return (
    <div className="card p-2">
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div>
          <strong>Ano:</strong> {turma?.ano} &nbsp; <strong>Período:</strong> {turma?.periodo} &nbsp; <strong>Disciplina:</strong> {turma?.disciplina?.nome} &nbsp; <strong>Prof.:</strong> {turma?.professor?.nome}
        </div>
        <div className="text-end">
          <small className="text-muted">Total de alunos da turma:</small>
          <div><strong>{total}</strong></div>
        </div>
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>CPF</th>
          </tr>
        </thead>
        <tbody>
          {atual.map((insc) => (
            <tr key={insc.id}>
              <td>{insc.id}</td>
              <td>{insc.aluno.nome}</td>
              <td>{insc.aluno.email}</td>
              <td>{insc.aluno.cpf ?? '-'}</td>
            </tr>
          ))}
          {filtradas.length === 0 && (
            <tr>
              <td colSpan={4}>Nenhum inscrito encontrado</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-start mt-2">
        <Paginacao pagina={pagina} totalDePaginas={totalDePaginas} tratarPaginacao={(p) => setPagina(Math.max(0, Math.min(p, totalDePaginas-1)))} />
      </div>
    </div>
  )
}

export default TabelaDeAlunosPorTurma
