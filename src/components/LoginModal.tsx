import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormValues } from '../lib/schemas'
import { useAuthStore } from '../store/authStore'

interface LoginModalProps {
  onClose: () => void
}

export function LoginModal({ onClose }: LoginModalProps) {
  const login = useAuthStore((state) => state.login)
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  })

  const onSubmit = async (values: LoginFormValues) => {
    const success = await login(values.username, values.password)
    if (success) {
      onClose()
    } else {
      setError('root', { message: useAuthStore.getState().error ?? 'Invalid username or password' })
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-xl border border-white/10 bg-neutral-900 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-white">Admin Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="text-sm text-white/70">
              Username
            </label>
            <input
              id="username"
              type="text"
              autoComplete="username"
              className="rounded-md border border-white/10 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-accent-hover"
              {...register('username')}
            />
            {errors.username && (
              <span className="text-xs text-red-400">{errors.username.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm text-white/70">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="rounded-md border border-white/10 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-accent-hover"
              {...register('password')}
            />
            {errors.password && (
              <span className="text-xs text-red-400">{errors.password.message}</span>
            )}
          </div>
          {errors.root && <span className="text-sm text-red-400">{errors.root.message}</span>}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-4 py-2 text-sm text-white/70 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
