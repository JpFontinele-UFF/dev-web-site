import AlunoForm from '../components/AlunoForm'
import { useState } from 'react'
import type { Aluno } from '../interfaces/Aluno'

const CadastroDeAlunosPage = () => {
  const [ultimo, setUltimo] = useState<Aluno | null>(null)

  return (
    <div className="container mt-4">
      <h2>Cadastro de Alunos</h2>
      <div className="row">
        <div className="col-md-6">
          <AlunoForm initial={undefined} />
        </div>
        <div className="col-md-6">
          {ultimo && (
            <div className="card p-3">
              <h5>Aluno salvo</h5>
              <div><strong>ID:</strong> {ultimo.id}</div>
              <div><strong>Nome:</strong> {ultimo.nome}</div>
              <div><strong>Email:</strong> {ultimo.email}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CadastroDeAlunosPage
