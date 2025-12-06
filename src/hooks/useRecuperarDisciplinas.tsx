import { useQuery } from '@tanstack/react-query'
import type { Disciplina } from '../interfaces/Disciplina'
import useApi from './useApi'

const useRecuperarDisciplinas = () => {
  const { list } = useApi<Disciplina>('/disciplinas')
  return useQuery<Disciplina[], Error>({
    queryKey: ['disciplinas'],
    queryFn: async () => {
      const data = await list()
      return data as Disciplina[]
    },
    staleTime: 10000,
  })
}

export default useRecuperarDisciplinas
