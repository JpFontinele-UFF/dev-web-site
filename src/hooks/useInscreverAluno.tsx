import { useMutation, useQueryClient } from '@tanstack/react-query'
import useApi from './useApi'

type Payload = { turmaId: number; alunoId: number }

const useInscreverAluno = () => {
  const qc = useQueryClient()
  const { create } = useApi<any>('/inscricoes')
  return useMutation<any, Error, Payload>({
    mutationFn: async (p: Payload) => {
      return create(p)
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
