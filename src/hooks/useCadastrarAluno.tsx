import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Aluno } from '../interfaces/Aluno'
import useApi from './useApi'

const API = '/alunos'

const useCadastrarAluno = () => {
  const qc = useQueryClient()
  const api = useApi()

  return useMutation<any, Error, Partial<Aluno>>({
    mutationFn: async (payload: Partial<Aluno>) => {
      const result = payload.id
        ? await api.put(`${API}/${payload.id}`, payload)
        : await api.post(API, payload)
      qc.invalidateQueries({ queryKey: ['alunos'] })
      return result
    },
  })
}

export default useCadastrarAluno
