import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import useApi from '../hooks/useApi'
import useAuthStore from '../store/useAuthStore'

const schema = z.object({ username: z.string().min(1), password: z.string().min(1) })
type FormData = z.infer<typeof schema>

const LoginPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const api = useApi()
  const setToken = useAuthStore((s) => s.setToken)
  const setUser = useAuthStore((s) => s.setUser)

  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(schema) })

  const msg = searchParams.get('msg')

  const onSubmit = async (d: FormData) => {
    try {
      const resp = await api.post('/auth/login', d)
      // expected { token, user }
      const token = resp?.token ?? resp?.accessToken ?? resp?.data?.token
      const user = resp?.user ?? resp?.data?.user ?? resp
      if (token) setToken(token)
      if (user) setUser(user)
      navigate('/')
    } catch (e: any) {
      alert('Falha no login: ' + (e?.message ?? String(e)))
    }
  }

  return (
    <div className="container mt-4">
      <h2>Login</h2>
      {msg && <div className="alert alert-warning">{msg}</div>}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <label className="form-label">Usuário</label>
          <input className="form-control" {...register('username')} />
        </div>
        <div className="mb-2">
          <label className="form-label">Senha</label>
          <input type="password" className="form-control" {...register('password')} />
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit">Entrar</button>
          <button type="button" className="btn btn-link" onClick={() => navigate('/cadastrar-usuario')}>Cadastrar-se</button>
        </div>
      </form>
    </div>
  )
}

export default LoginPage
