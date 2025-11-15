import { useQuery } from '@tanstack/react-query'
import type { Aluno } from '../interfaces/Aluno'

const TURMAS_API = '/turmas'

const useRecuperarAlunosNaoInscritos = (turmaId: number | null) => {
  return useQuery<Aluno[], Error>({
    queryKey: ['turmas', turmaId, 'alunos-nao-inscritos'],
    queryFn: async () => {
      if (!turmaId) return []

      // Tenta endpoint direto /turmas/{id}/alunos-nao-inscritos
      try {
        const direct = await fetch(`${TURMAS_API}/${turmaId}/alunos-nao-inscritos`)
        if (direct.ok) {
          const json = await direct.json()
          return (json?.data ?? json) as Aluno[]
        }
      } catch {
        // fallthrough para strategy de fallback
      }

      // Fallback: buscar turma para obter os inscritos, e todos os alunos, então filtrar
      const turmaRes = await fetch(`${TURMAS_API}/${turmaId}`)
      if (!turmaRes.ok) {
        const body = await turmaRes.text().catch(() => '')
        throw new Error(`Failed to fetch turma ${turmaId}: ${turmaRes.status} ${body}`)
      }
      const turmaJson = await turmaRes.json()
      const turmaData = turmaJson?.data ?? turmaJson
      const inscricoes = Array.isArray(turmaData.inscricoes) ? turmaData.inscricoes : (turmaData.alunos ?? [])
      const inscritosIds = new Set(inscricoes.map((i: any) => i.aluno?.id ?? i.id ?? i.inscricaoId ?? 0))

      const allRes = await fetch('/alunos')
      if (!allRes.ok) {
        const body = await allRes.text().catch(() => '')
        throw new Error(`Failed to fetch alunos: ${allRes.status} ${body}`)
      }
      const jsonAll = await allRes.json()
      const all = (jsonAll?.data ?? jsonAll) as Aluno[]

      return all.filter((a) => !inscritosIds.has(a.id))
    },
    enabled: !!turmaId,
    staleTime: 5000,
  })
}

export default useRecuperarAlunosNaoInscritos
