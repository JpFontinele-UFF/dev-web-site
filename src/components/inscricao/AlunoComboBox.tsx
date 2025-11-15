import useRecuperarAlunosNaoInscritos from '../../hooks/useRecuperarAlunosNaoInscritos'
import useInscricaoStore from '../../store/useInscricaoStore'

const AlunoComboBox = () => {
  const turmaId = useInscricaoStore((s) => s.turmaId)
  const alunoId = useInscricaoStore((s) => s.alunoId)
  const setAlunoId = useInscricaoStore((s) => s.setAlunoId)
  const { data: alunos = [], isLoading } = useRecuperarAlunosNaoInscritos(turmaId)

  const handle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value
    setAlunoId(v ? Number(v) : null)
  }

  return (
    <div className="mb-2">
      <label className="form-label">Nome:</label>
      <select className="form-select" value={alunoId ?? ''} onChange={handle} disabled={isLoading || !turmaId}>
        <option value="">Selecione...</option>
        {alunos.map((a) => (
          <option key={a.id} value={a.id}>{a.nome}</option>
        ))}
      </select>
    </div>
  )
}

export default AlunoComboBox
