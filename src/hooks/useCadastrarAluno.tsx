import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Aluno } from '../interfaces/Aluno'
import useFetchWithAuth from './useFetchWithAuth'

const API = '/alunos'

const useCadastrarAluno = () => {
  const qc = useQueryClient()
  const fetchWithAuth = useFetchWithAuth()
  return useMutation<any, Error, Partial<Aluno>>({
    mutationFn: async (payload: Partial<Aluno>) => {
      const method = payload.id ? 'PUT' : 'POST'
      const url = payload.id ? `${API}/${payload.id}` : API
      const json = await fetchWithAuth(url, {
        method,
        body: JSON.stringify(payload),
      })
      qc.invalidateQueries({ queryKey: ['alunos'] })
      return json
    }
  })
}

export default useCadastrarAluno
