import { useQuery } from '@tanstack/react-query'
import { fetchLanSettings } from '../lib/api'

export function useLanSettingsQuery() {
  return useQuery({
    queryKey: ['lan-settings'],
    queryFn: fetchLanSettings,
  })
}
