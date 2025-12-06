import { useQuery } from '@tanstack/react-query'
import type { Aluno } from '../interfaces/Aluno'
import useApi from './useApi'

const useRecuperarAlunoPorId = (id: number | null) => {
  const { getById } = useApi<Aluno>('/alunos')
  return useQuery<Aluno, Error>({
    queryKey: ['alunos', id],
    queryFn: async () => {
      if (!id) throw new Error('id inválido')
      const aluno = await getById(id)
      return (aluno as any)?.data ?? (aluno as any) ?? aluno
    },
    enabled: !!id,
  })
}

export default useRecuperarAlunoPorId
