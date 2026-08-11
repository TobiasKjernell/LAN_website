import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login as loginRequest } from '../lib/api'
import { isTokenExpired } from '../lib/jwt'

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  error: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isAuthenticated: false,
      error: null,
      login: async (username, password) => {
        try {
          const { access_token } = await loginRequest(username, password)
          set({ token: access_token, isAuthenticated: true, error: null })
          return true
        } catch (err) {
          set({
            token: null,
            isAuthenticated: false,
            error: err instanceof Error ? err.message : 'Invalid username or password',
          })
          return false
        }
      },
      logout: () => set({ token: null, isAuthenticated: false, error: null }),
    }),
    {
      name: 'lan-party-auth',
      partialize: (state) => ({ token: state.token, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        if (state?.token && isTokenExpired(state.token)) {
          state.token = null
          state.isAuthenticated = false
        }
      },
    },
  ),
)
