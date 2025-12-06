import { useQuery } from '@tanstack/react-query'
import type { Turma } from '../interfaces/Turma'
import useApi from './useApi'

const useRecuperarTurmasPorDisciplina = (disciplinaId: number | null) => {
  const { list } = useApi<Turma>('/turmas')
  return useQuery<Turma[], Error>({
    queryKey: ['turmas', 'porDisciplina', disciplinaId],
    queryFn: async () => {
      if (!disciplinaId) return []
      const data = await list({ disciplinaId })

      const filtradas = data.filter((t) => {
        const discId = (t as any)?.disciplina?.id ?? (t as any)?.disciplinaId ?? null
        return discId === disciplinaId
      })

      return filtradas.length > 0 ? filtradas : data
    },
    enabled: !!disciplinaId,
    staleTime: 10000,
  })
}

export default useRecuperarTurmasPorDisciplina
