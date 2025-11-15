import DisciplinaComboBox from './DisciplinaComboBox'
import TurmaComboBox from './TurmaComboBox'
import AlunoComboBox from './AlunoComboBox'
import useInscricaoStore from '../../store/useInscricaoStore'
import useInscreverAluno from '../../hooks/useInscreverAluno'

const InscricaoForm = () => {
  const turmaId = useInscricaoStore((s) => s.turmaId)
  const alunoId = useInscricaoStore((s) => s.alunoId)
  const setAlunoId = useInscricaoStore((s) => s.setAlunoId)

  const inscricao = useInscreverAluno()

  const handleInscrever = async () => {
    if (!turmaId || !alunoId) return
    try {
      await inscricao.mutateAsync({ turmaId, alunoId })
      // limpar seleção de aluno para forçar recarga do combo
      setAlunoId(null)
    } catch (err) {
      // swallow here; caller UI may show
      console.error(err)
    }
  }

  return (
    <div className="card p-3 mb-3">
      <div className="row">
        <div className="col-md-4"><DisciplinaComboBox /></div>
        <div className="col-md-4"><TurmaComboBox /></div>
        <div className="col-md-4"><AlunoComboBox /></div>
      </div>
      <div className="mt-2">
        <button className="btn btn-primary" onClick={handleInscrever} disabled={!turmaId || !alunoId}>
          Inscrever Aluno
        </button>
      </div>
    </div>
  )
}

export default InscricaoForm
