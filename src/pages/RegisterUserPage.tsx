import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useApi from '../hooks/useApi'
import useAuthStore from '../store/useAuthStore'
import { useNavigate } from 'react-router-dom'

const schema = z.object({
  username: z.string().min(3),
  password: z.string().min(4),
  nome: z.string().min(3),
  role: z.enum(['USER', 'ADMIN']).optional(),
})

type FormData = z.infer<typeof schema>

const RegisterUserPage = () => {
  const api = useApi()
  const navigate = useNavigate()
  const isAdmin = useAuthStore((s) => s.isAdmin())

  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (d: FormData) => {
    try {
      // backend should expose an endpoint to create users, typically /auth/register
      await api.post('/auth/register', { username: d.username, password: d.password, nome: d.nome, roles: [d.role ?? 'USER'] })
      alert('Usuário criado com sucesso')
      navigate('/')
    } catch (e: any) {
      alert('Erro ao criar usuário: ' + (e?.message ?? String(e)))
    }
  }

  if (!isAdmin) {
    return (
      <div className="container mt-4">
        <h2>Cadastro de usuário</h2>
        <div className="alert alert-warning">Apenas administradores podem cadastrar novos usuários.</div>
      </div>
    )
  }

  return (
    <div className="container mt-4">
      <h2>Cadastrar Usuário</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <label className="form-label">Nome</label>
          <input className="form-control" {...register('nome')} />
        </div>
        <div className="mb-2">
          <label className="form-label">Usuário</label>
          <input className="form-control" {...register('username')} />
        </div>
        <div className="mb-2">
          <label className="form-label">Senha</label>
          <input type="password" className="form-control" {...register('password')} />
        </div>
        <div className="mb-2">
          <label className="form-label">Perfil</label>
          <select className="form-select" {...register('role')}>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>
        <button className="btn btn-primary" type="submit">Criar</button>
      </form>
    </div>
  )
}

export default RegisterUserPage
