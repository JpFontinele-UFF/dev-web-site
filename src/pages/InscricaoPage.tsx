import InscricaoForm from '../components/inscricao/InscricaoForm'
import TabelaDeAlunosPorTurma from '../components/inscricao/TabelaDeAlunosPorTurma'
import Pesquisa from '../components/Pesquisa'
import useInscricaoStore from '../store/useInscricaoStore'

const InscricaoPage = () => {
  const setPesquisa = useInscricaoStore((s) => s.setPesquisa)

  return (
    <div className="container mt-4">
      <h2>Inscrição de Aluno em Turma</h2>
      <div className="card p-3 mb-3">
        <InscricaoForm />
      </div>
      <div className="mb-3">
        <Pesquisa tratarPesquisa={(q) => setPesquisa(q)} />
      </div>
      <TabelaDeAlunosPorTurma />
    </div>
  )
}

export default InscricaoPage
