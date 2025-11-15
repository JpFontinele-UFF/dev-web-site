import create from 'zustand'

type State = {
  disciplinaId: number | null
  turmaId: number | null
  alunoId: number | null
  pesquisa: string
  pagina: number
  setDisciplinaId: (id: number | null) => void
  setTurmaId: (id: number | null) => void
  setAlunoId: (id: number | null) => void
  setPesquisa: (q: string) => void
  setPagina: (p: number) => void
  resetTurmaAluno: () => void
}

const useInscricaoStore = create<State>((set) => ({
  disciplinaId: null,
  turmaId: null,
  alunoId: null,
  pesquisa: '',
  pagina: 0,
  setDisciplinaId: (id) => set((s) => ({ ...s, disciplinaId: id })),
  setTurmaId: (id) => set((s) => ({ ...s, turmaId: id })),
  setAlunoId: (id) => set((s) => ({ ...s, alunoId: id })),
  setPesquisa: (q) => set((s) => ({ ...s, pesquisa: q })),
  setPagina: (p) => set((s) => ({ ...s, pagina: p })),
  resetTurmaAluno: () => set(() => ({ turmaId: null, alunoId: null, pesquisa: '' })),
}))

export default useInscricaoStore
