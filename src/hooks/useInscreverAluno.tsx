import { useMutation, useQueryClient } from '@tanstack/react-query'

type Payload = { turmaId: number; alunoId: number }

const API = '/inscricoes'

const useInscreverAluno = () => {
  const qc = useQueryClient()
  return useMutation<any, Error, Payload>({
    mutationFn: async (p: Payload) => {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`Failed to inscrever: ${res.status} ${body}`)
      }
      const json = await res.json()
      return json
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['turmas', vars.turmaId] })
      qc.invalidateQueries({ queryKey: ['turmas', 'porDisciplina'] })
      qc.invalidateQueries({ queryKey: ['turmas', vars.turmaId, 'alunos-nao-inscritos'] })
      qc.invalidateQueries({ queryKey: ['alunos'] })
    }
  })
}

export default useInscreverAluno
