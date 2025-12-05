import { create } from 'zustand'

type UserInfo = {
  id?: number
  nome?: string
  username?: string
  roles?: string[]
}

type AuthState = {
  token?: string | null
  user?: UserInfo | null
  message?: string | null
  setToken: (token?: string | null) => void
  setUser: (u?: UserInfo | null) => void
  setMessage: (m?: string | null) => void
  logout: () => void
  isAdmin: () => boolean
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  message: null,
  setToken: (token) => set({ token }),
  setUser: (user) => set({ user }),
  setMessage: (message) => set({ message }),
  logout: () => set({ token: null, user: null }),
  isAdmin: () => {
    const u = get().user
    if (!u || !u.roles) return false
    return u.roles.includes('ADMIN')
  },
}))

export default useAuthStore
