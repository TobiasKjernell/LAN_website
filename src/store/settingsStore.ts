import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { LanSettings } from '../types'
import { toLocalDateTimeInputValue } from '../lib/date'

function defaultTargetDate(): string {
  const date = new Date()
  date.setDate(date.getDate() + 30)
  return toLocalDateTimeInputValue(date)
}

interface SettingsState extends LanSettings {
  updateSettings: (settings: Partial<LanSettings>) => void
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      eventName: 'LAN Party',
      targetDate: defaultTargetDate(),
      backgroundImage: null,
      updateSettings: (settings) => set((state) => ({ ...state, ...settings })),
    }),
    {
      name: 'lan-party-settings',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.backgroundImage = null
        }
      },
      partialize: (state) => ({
        eventName: state.eventName,
        targetDate: state.targetDate,
      }),
    },
  ),
)
