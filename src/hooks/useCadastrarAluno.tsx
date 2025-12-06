import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Aluno } from '../interfaces/Aluno'
import useApi from './useApi'

const useCadastrarAluno = () => {
  const qc = useQueryClient()
  const { save } = useApi<Aluno>('/alunos')
  return useMutation<any, Error, Partial<Aluno>>({
    mutationFn: async (payload: Partial<Aluno>) => save(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['alunos'] })
    }
  })
}

export default useCadastrarAluno
