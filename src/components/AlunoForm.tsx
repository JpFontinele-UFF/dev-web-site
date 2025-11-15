import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import useCadastrarAluno from '../hooks/useCadastrarAluno'
import type { Aluno } from '../interfaces/Aluno'
import { useEffect } from 'react'

const alunoSchema = z.object({
  id: z.number().optional(),
  nome: z.string().min(3, 'Nome deve ter ao menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  cpf: z.string().min(3, 'CPF inválido'),
})

type FormData = z.infer<typeof alunoSchema>

const AlunoForm = ({ initial }: { initial?: Partial<Aluno> }) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(alunoSchema),
    defaultValues: initial as any,
  })

  useEffect(() => {
    reset(initial as any)
  }, [initial, reset])

  const cadastrar = useCadastrarAluno()

  const onSubmit = async (data: FormData) => {
    try {
      await cadastrar.mutateAsync(data)
      alert('Aluno salvo com sucesso')
    } catch (err: any) {
      alert('Erro ao salvar: ' + (err?.message ?? String(err)))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2">
        <label className="form-label">Nome</label>
        <input className="form-control" {...register('nome')} />
        {errors.nome && <div className="text-danger">{String(errors.nome.message)}</div>}
      </div>

      <div className="mb-2">
        <label className="form-label">Email</label>
        <input className="form-control" {...register('email')} />
        {errors.email && <div className="text-danger">{String(errors.email.message)}</div>}
      </div>

      <div className="mb-2">
        <label className="form-label">CPF</label>
        <input className="form-control" {...register('cpf')} />
        {errors.cpf && <div className="text-danger">{String(errors.cpf.message)}</div>}
      </div>

      <button className="btn btn-primary" type="submit">Salvar</button>
    </form>
  )
}

export default AlunoForm
