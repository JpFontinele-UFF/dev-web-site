import { useQuery } from '@tanstack/react-query'
import type { Disciplina } from '../interfaces/Disciplina'

const API = '/disciplinas'

const useRecuperarDisciplinas = () => {
  return useQuery<Disciplina[], Error>({
    queryKey: ['disciplinas'],
    queryFn: async () => {
      try {
        const res = await fetch(API)
        if (!res.ok) {
          const body = await res.text().catch(() => '')
          throw new Error(`Failed to fetch disciplinas: ${res.status} ${res.statusText} ${body}`)
        }
        const json = await res.json()
        const data = json?.data ?? json
        return data as Disciplina[]
      } catch (err: unknown) {
        if (err instanceof Error) throw err
        throw new Error(String(err))
      }
    },
    staleTime: 10000,
  })
}

export default useRecuperarDisciplinas
