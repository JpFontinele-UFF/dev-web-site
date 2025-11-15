import useRecuperarTurmasPorDisciplina from '../../hooks/useRecuperarTurmasPorDisciplina'
import useInscricaoStore from '../../store/useInscricaoStore'
import { useEffect } from 'react'

const TurmaComboBox = () => {
  const disciplinaId = useInscricaoStore((s) => s.disciplinaId)
  const setTurmaId = useInscricaoStore((s) => s.setTurmaId)
  const turmaId = useInscricaoStore((s) => s.turmaId)
  const { data: turmas = [], isLoading, isError, error } = useRecuperarTurmasPorDisciplina(disciplinaId)

  useEffect(() => {
    // limpa turma quando disciplina muda
    setTurmaId(null)
  }, [disciplinaId, setTurmaId])

  const handle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value
    setTurmaId(v ? Number(v) : null)
  }

  return (
    <div className="mb-2">
      <label className="form-label">Turma:</label>
      <select value={turmaId ?? ''} className="form-select" onChange={handle} disabled={isLoading || !disciplinaId}>
        <option value="">Selecione...</option>
        {turmas.map((t) => (
          <option key={t.id} value={t.id}>{t.codigoTurma ?? t.id}</option>
        ))}
      </select>
      {isError && <div className="text-danger small mt-1">Erro ao carregar turmas: {(error as Error)?.message ?? String(error)}</div>}
      {!isLoading && turmas.length === 0 && disciplinaId && !isError && (
        <div className="text-muted small mt-1">Nenhuma turma encontrada para esta disciplina</div>
      )}
    </div>
  )
}

export default TurmaComboBox
