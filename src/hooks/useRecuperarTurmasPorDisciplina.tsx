import { useQuery } from '@tanstack/react-query'
import type { Turma } from '../interfaces/Turma'

const API_BASE = '/turmas'

const useRecuperarTurmasPorDisciplina = (disciplinaId: number | null) => {
  return useQuery<Turma[], Error>({
    queryKey: ['turmas', 'porDisciplina', disciplinaId],
    queryFn: async () => {
      if (!disciplinaId) return []
      const res = await fetch(`${API_BASE}?disciplinaId=${disciplinaId}`)
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`Failed to fetch turmas por disciplina: ${res.status} ${body}`)
      }
      const json = await res.json()
      const data = (json?.data ?? json) as Turma[]

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
