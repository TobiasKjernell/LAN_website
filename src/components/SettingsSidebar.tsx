import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { settingsSchema, type SettingsFormValues } from '../lib/schemas'
import { useSettingsStore } from '../store/settingsStore'
import { useAuthStore } from '../store/authStore'
import { useToastStore } from '../store/toastStore'

interface SettingsSidebarProps {
  open: boolean
  onClose: () => void
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export function SettingsSidebar({ open, onClose }: SettingsSidebarProps) {
  const eventName = useSettingsStore((state) => state.eventName)
  const targetDate = useSettingsStore((state) => state.targetDate)
  const backgroundImageValue = useSettingsStore((state) => state.backgroundImage)
  const updateSettings = useSettingsStore((state) => state.updateSettings)
  const settings = { eventName, targetDate, backgroundImage: backgroundImageValue }
  const logout = useAuthStore((state) => state.logout)
  const showToast = useToastStore((state) => state.showToast)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: settings,
  })

  useEffect(() => { 
    if (open) {
      reset(settings)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const backgroundImage = watch('backgroundImage')

  const onSubmit = (values: SettingsFormValues) => {
    updateSettings(values)
    showToast('Settings saved')
    onClose()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const dataUrl = await readFileAsDataUrl(file)
    setValue('backgroundImage', dataUrl, { shouldDirty: true, shouldValidate: true })
  }

  console.log('backgroundImageValue:', backgroundImageValue)

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l border-white/10 bg-neutral-900 shadow-2xl transition-transform ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold text-white">Event Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white/60 hover:text-white"
            aria-label="Close settings"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-5"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="eventName" className="text-sm text-white/70">
              LAN party name
            </label>
            <input
              id="eventName"
              type="text"
              className="rounded-md border border-white/10 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-accent-hover"
              {...register('eventName')}
            />
            {errors.eventName && (
              <span className="text-xs text-red-400">{errors.eventName.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="targetDate" className="text-sm text-white/70">
              Countdown target date
            </label>
            <input
              id="targetDate"
              type="datetime-local"
              className="rounded-md border border-white/10 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-accent-hover [color-scheme:dark]"
              {...register('targetDate')}
            />
            {errors.targetDate && (
              <span className="text-xs text-red-400">{errors.targetDate.message}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm text-white/70">Background image</span>
            {backgroundImage != null ? (
              <img
                src={backgroundImage}
                alt="Background preview"
                className="h-32 w-full rounded-md border border-white/10 object-cover"
              />
            ) : <div className="h-32 w-full rounded-md border border-white/10 bg-[#222]" />}
            <input
              type="file" 
              accept="image/*"
              onChange={handleFileChange}
              className="text-sm text-white/70 file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-2 file:text-sm file:text-white hover:file:bg-accent-hover"
            />
            {errors.backgroundImage && (
              <span className="text-xs text-red-400">{errors.backgroundImage.message}</span>
            )}
          </div>

          <div className="mt-auto flex flex-col gap-2 pt-4">
            <button
              type="submit"
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={() => {
                logout()
                onClose()
              }}
              className="rounded-md border border-white/10 px-4 py-2 text-sm text-white/70 hover:text-white"
            >
              Log out
            </button>
          </div>
        </form>
      </aside>
    </>
  )
}
