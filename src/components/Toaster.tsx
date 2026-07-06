import { useToastStore } from '../store/toastStore'

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts)
  const dismissToast = useToastStore((state) => state.dismissToast)

  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 left-1/2 z-60 flex -translate-x-1/2 flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          onClick={() => dismissToast(toast.id)}
          className="cursor-pointer rounded-md border border-white/10 bg-neutral-900 px-4 py-2.5 text-sm text-white shadow-2xl"
        >
          {toast.message}
        </div>
      ))}
    </div>
  )
}
