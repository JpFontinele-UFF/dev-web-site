import { useQuery } from '@tanstack/react-query'
import type { Aluno } from '../interfaces/Aluno'
import useApi from './useApi'

const useRecuperarAlunosNaoInscritos = (turmaId: number | null) => {
  const turmasApi = useApi<any>('/turmas')
  const alunosApi = useApi<Aluno>('/alunos')

  return useQuery<Aluno[], Error>({
    queryKey: ['turmas', turmaId, 'alunos-nao-inscritos'],
    queryFn: async () => {
      if (!turmaId) return []

      try {
        const direct = await turmasApi.getPath<Aluno[]>(`/${turmaId}/alunos-nao-inscritos`)
        if (direct) return (direct as any)?.data ?? (direct as any) ?? (direct as Aluno[])
      } catch {
      }

      const turmaData = await turmasApi.getById(turmaId)
      const inscricoes = Array.isArray((turmaData as any)?.inscricoes)
        ? (turmaData as any).inscricoes
        : ((turmaData as any)?.alunos ?? [])
      const inscritosIds = new Set(inscricoes.map((i: any) => i.aluno?.id ?? i.id ?? i.inscricaoId ?? 0))

      const all = await alunosApi.list()

      return all.filter((a) => !inscritosIds.has(a.id))
    },
    enabled: !!turmaId,
    staleTime: 5000,
  })
}

export default useRecuperarAlunosNaoInscritos
