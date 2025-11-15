import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Aluno } from '../interfaces/Aluno'

const API = '/alunos'

const useCadastrarAluno = () => {
  const qc = useQueryClient()
  return useMutation<any, Error, Partial<Aluno>>({
    mutationFn: async (payload: Partial<Aluno>) => {
      const method = payload.id ? 'PUT' : 'POST'
      const url = payload.id ? `${API}/${payload.id}` : API
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.text().catch(() => '')
        throw new Error(`Failed to salvar aluno: ${res.status} ${body}`)
      }
      const json = await res.json()
      qc.invalidateQueries({ queryKey: ['alunos'] })
      return json
    }
  })
}

export default useCadastrarAluno
