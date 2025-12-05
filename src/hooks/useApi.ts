import axios, { AxiosInstance } from 'axios'
import useAuthStore from '../store/useAuthStore'

const baseURL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080'

let axiosInstance: AxiosInstance | null = null

const getInstance = () => {
  if (axiosInstance) return axiosInstance
  axiosInstance = axios.create({ baseURL })

  axiosInstance.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers = config.headers ?? {}
      ;(config.headers as any).Authorization = `Bearer ${token}`
    }
    return config
  })

  axiosInstance.interceptors.response.use(
    (res) => res,
    (err) => {
      const status = err?.response?.status
      if (status === 401) {
        // Not authenticated
        const msg = 'Necessário estar autenticado para acessar este recurso.'
        window.location.href = `/login?msg=${encodeURIComponent(msg)}`
        return Promise.reject(new Error(msg))
      }
      if (status === 403) {
        const msg = 'Você não tem permissão para acessar este recurso.'
        window.location.href = `/login?msg=${encodeURIComponent(msg)}`
        return Promise.reject(new Error(msg))
      }
      return Promise.reject(err)
    }
  )

  return axiosInstance
}

const useApi = () => {
  const inst = getInstance()

  return {
    get: async <T = any>(url: string, config?: any) => {
      const res = await inst.get(url, config)
      return res.data
    },
    post: async <T = any>(url: string, body?: any, config?: any) => {
      const res = await inst.post(url, body, config)
      return res.data
    },
    put: async <T = any>(url: string, body?: any, config?: any) => {
      const res = await inst.put(url, body, config)
      return res.data
    },
    delete: async <T = any>(url: string, config?: any) => {
      const res = await inst.delete(url, config)
      return res.data
    },
    instance: inst,
  }
}

export default useApi
