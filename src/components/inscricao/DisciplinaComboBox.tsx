import useRecuperarDisciplinas from '../../hooks/useRecuperarDisciplinas'
import useInscricaoStore from '../../store/useInscricaoStore'

const DisciplinaComboBox = () => {
  const { data: disciplinas = [], isLoading, isError, error } = useRecuperarDisciplinas()
  const setDisciplinaId = useInscricaoStore((s) => s.setDisciplinaId)
  const disciplinaId = useInscricaoStore((s) => s.disciplinaId)

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value
    setDisciplinaId(val ? Number(val) : null)
  }

  return (
    <div className="mb-2">
      <label className="form-label">Disciplina:</label>
      <select value={disciplinaId ?? ''} className="form-select" onChange={handleChange} disabled={isLoading}>
        <option value="">Selecione...</option>
        {disciplinas.map((d) => (
          <option key={d.id} value={d.id}>{d.nome}</option>
        ))}
      </select>
      {isError && <div className="text-danger small mt-1">Erro ao carregar disciplinas: {(error as Error)?.message ?? String(error)}</div>}
      {!isLoading && disciplinas.length === 0 && !isError && (
        <div className="text-muted small mt-1">Nenhuma disciplina encontrada</div>
      )}
    </div>
  )
}

export default DisciplinaComboBox
