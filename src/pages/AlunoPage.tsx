import { useParams } from 'react-router-dom'
import useRecuperarAlunoPorId from '../hooks/useRecuperarAlunoPorId'

const AlunoPage = () => {
  const params = useParams()
  const id = Number(params.id) || null
  const { data: aluno, isLoading } = useRecuperarAlunoPorId(id)

  if (!id) return <div className="container mt-4">ID inválido</div>
  if (isLoading) return <div className="container mt-4">Carregando...</div>
  if (!aluno) return <div className="container mt-4">Aluno não encontrado</div>

  return (
    <div className="container mt-4">
      <h2>Aluno {aluno.nome}</h2>
      <div className="card p-3">
        <div><strong>ID:</strong> {aluno.id}</div>
        <div><strong>Nome:</strong> {aluno.nome}</div>
        <div><strong>Email:</strong> {aluno.email}</div>
        <div><strong>CPF:</strong> {aluno.cpf}</div>
      </div>
    </div>
  )
}

export default AlunoPage
