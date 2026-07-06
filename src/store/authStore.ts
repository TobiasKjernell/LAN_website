import { create } from 'zustand'

const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: '123',
}

interface AuthState {
  isAuthenticated: boolean
  error: string | null
  login: (username: string, password: string) => boolean
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  error: null,
  login: (username, password) => {
    const success =
      username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password
    set({
      isAuthenticated: success,
      error: success ? null : 'Invalid username or password',
    })
    return success
  },
  logout: () => set({ isAuthenticated: false, error: null }),
}))
