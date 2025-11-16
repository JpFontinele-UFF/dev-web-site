import AlunoForm from '../components/AlunoForm'
import { useEffect, useState } from 'react'
import type { Aluno } from '../interfaces/Aluno'
import useRecuperarAlunos from '../hooks/useRecuperarAlunos'

const CadastroDeAlunosPage = () => {
  const [ultimo, setUltimo] = useState<Aluno | null>(null)
  const [modo, setModo] = useState<'incluir' | 'alterar' | null>(null)
  const [cpfBusca, setCpfBusca] = useState('')
  const [alunoParaEditar, setAlunoParaEditar] = useState<Aluno | null>(null)

  const { data: alunos = [], isLoading } = useRecuperarAlunos()

  useEffect(() => {
    // limpa buscas quando muda modo
    setCpfBusca('')
    setAlunoParaEditar(null)
  }, [modo])

  const buscarPorCpf = () => {
    if (!cpfBusca) {
      alert('Informe o CPF para busca')
      return
    }
    const encontrado = alunos.find((a) => (a.cpf ?? '').replace(/\D/g, '') === cpfBusca.replace(/\D/g, ''))
    if (!encontrado) {
      alert('Aluno com esse CPF não encontrado')
      return
    }
    setAlunoParaEditar(encontrado)
    setModo('alterar')
  }

  const onAlunoSalvo = (a: Aluno) => {
    setUltimo(a)
    setAlunoParaEditar(null)
    setModo(null)
  }

  return (
    <div className="container mt-4">
      <h2>Cadastro de Alunos</h2>

      <div className="card p-3 mb-3">
        <div className="d-flex gap-2 mb-3">
          <button className="btn btn-outline-primary" onClick={() => setModo('incluir')}>Incluir</button>
          <button className="btn btn-outline-secondary" onClick={() => setModo('alterar')}>Alterar</button>
          <button className="btn btn-link" onClick={() => setModo(null)}>Fechar</button>
        </div>

        {modo === 'incluir' && (
          <div className="row">
            <div className="col-md-6">
              <AlunoForm initial={undefined} onSaved={onAlunoSalvo} />
            </div>
          </div>
        )}

        {modo === 'alterar' && (
          <div>
            <div className="row mb-3">
              <div className="col-md-4">
                <input value={cpfBusca} onChange={(e) => setCpfBusca(e.target.value)} placeholder="CPF" className="form-control" />
              </div>
              <div className="col-md-8">
                <button className="btn btn-primary me-2" onClick={buscarPorCpf} disabled={isLoading}>Buscar</button>
                <button className="btn btn-secondary" onClick={() => { setCpfBusca(''); setAlunoParaEditar(null) }}>Limpar</button>
              </div>
            </div>

            {alunoParaEditar && (
              <div className="row">
                <div className="col-md-6">
                  <h5>Editando: {alunoParaEditar.nome}</h5>
                  <AlunoForm initial={alunoParaEditar} onSaved={onAlunoSalvo} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="row">
        <div className="col-md-6">
          {ultimo && (
            <div className="card p-3">
              <h5>Último aluno salvo</h5>
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
