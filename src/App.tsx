import { LogIn, Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Countdown } from './components/Countdown'
import { IntroSplash } from './components/IntroSplash'
import { LoginModal } from './components/LoginModal'
import { SettingsSidebar } from './components/SettingsSidebar'
import { Toaster } from './components/Toaster'
import { useLanSettingsQuery } from './hooks/useLanSettings'
import { useAuthStore } from './store/authStore'
import { useSettingsStore } from './store/settingsStore'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { eventName, targetDate, backgroundImage, updateSettings } = useSettingsStore()

  const [loginOpen, setLoginOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [introDone, setIntroDone] = useState(false)

  const { data: lanSettings } = useLanSettingsQuery()

  useEffect(() => {
    if (!lanSettings) return
    updateSettings({
      eventName: lanSettings.name,
      targetDate: lanSettings.lan_date
        ? new Date(lanSettings.lan_date).toISOString().slice(0, 16)
        : targetDate,
      backgroundImage: lanSettings.image_url,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lanSettings])

  return (
    <>
      <div className="min-h-screen bg-[#222] p-5">
        <div
          className="relative flex min-h-[calc(100svh-2.5rem)] items-center justify-center overflow-hidden rounded-2xl border-2 border-white/50 bg-neutral-950 bg-cover bg-center shadow-[0_25px_80px_-20px] shadow-black"
          style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        >
          <div className="absolute inset-0 bg-black/55" />

          <div className="absolute right-5 top-5 z-10">
            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                aria-label="Settings"
                title="Settings"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
              >
                <Settings className="h-5 w-5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                aria-label="Admin Login"
                title="Admin Login"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-sm hover:bg-black/60"
              >
                <LogIn className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="relative z-10 flex flex-col items-center gap-6 px-4 text-center sm:gap-10 sm:px-6">
            <h1 className="font-countdown bg-linear-to-b from-white to-white/70 bg-clip-text text-3xl font-black tracking-wide text-transparent drop-shadow-[0_0_35px_rgba(255,255,255,0.25)] sm:text-5xl md:text-6xl">
              {eventName}
            </h1>
            <div className="flex flex-col items-center gap-3">
              <Countdown targetDate={targetDate} />
              {lanSettings?.lan_date && (
                <p className="text-sm font-medium tracking-wide text-white sm:text-base">
                  {new Date(lanSettings.lan_date).toLocaleString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
        <SettingsSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Toaster />
      </div>
      {!introDone && <IntroSplash onComplete={() => setIntroDone(true)} />}
    </>
  )
}

export default App
