import { useQuery } from '@tanstack/react-query'
import type { Aluno } from '../interfaces/Aluno'

const API = '/alunos'

const useRecuperarAlunoPorId = (id: number | null) => {
  return useQuery<Aluno, Error>({
    queryKey: ['alunos', id],
    queryFn: async () => {
      if (!id) throw new Error('id inválido')
      const res = await fetch(`${API}/${id}`)
      if (!res.ok) throw new Error('Aluno não encontrado')
      const json = await res.json()
      return (json?.data ?? json) as Aluno
    },
    enabled: !!id,
  })
}

export default useRecuperarAlunoPorId
