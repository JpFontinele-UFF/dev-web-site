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
        let message = ''
        try {
          const contentType = res.headers.get('content-type') || ''
          if (contentType.includes('application/json')) {
            const bodyJson = await res.json().catch(() => null)
            if (bodyJson) {
              message = bodyJson.message ?? bodyJson.error ?? bodyJson.mensagem ?? JSON.stringify(bodyJson)
            } else {
              message = await res.text().catch(() => '')
            }
          } else {
            message = await res.text().catch(() => '')
          }
        } catch (e) {
          message = ''
        }
        if (message && message.trim().length > 0) {
          throw new Error(message)
        }
        throw new Error(`Ocorreu um erro ao salvar aluno: ${res.status}`)
      }
      const json = await res.json()
      qc.invalidateQueries({ queryKey: ['alunos'] })
      return json
    }
  })
}

export default useCadastrarAluno
