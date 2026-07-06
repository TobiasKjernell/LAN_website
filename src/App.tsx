import { useState } from 'react'
import { Countdown } from './components/Countdown'
import { LoginModal } from './components/LoginModal'
import { SettingsSidebar } from './components/SettingsSidebar'
import { Toaster } from './components/Toaster'
import { useAuthStore } from './store/authStore'
import { useSettingsStore } from './store/settingsStore'

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const { eventName, targetDate, backgroundImage } = useSettingsStore()

  const [loginOpen, setLoginOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#222] p-5">
      <div
        className="relative flex min-h-[calc(100svh-2.5rem)] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-neutral-950 bg-cover bg-center shadow-[0_25px_80px_-20px] shadow-black"
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
      >
        <div className="absolute inset-0 bg-black/55" />

        <div className="absolute right-5 top-5 z-10">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-md border border-white/20 bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/60"
            >
              Settings
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="rounded-md border border-white/20 bg-black/40 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm hover:bg-black/60"
            >
              Admin Login
            </button>
          )}
        </div>

        <div className="relative z-10 flex flex-col items-center gap-10 px-6 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            {eventName}
          </h1>
          <Countdown targetDate={targetDate} />
        </div>
      </div>

      {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      <SettingsSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Toaster />
    </div>
  )
}

export default App
