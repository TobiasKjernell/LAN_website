import type { AuthToken, LanSettingsDto } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  } 
}

export async function fetchLanSettings(): Promise<LanSettingsDto> {
  const response = await fetch(`${API_BASE_URL}/api/lan-settings`)
  if (!response.ok) {
    throw new Error(`Failed to fetch LAN settings: ${response.status}`)
  }
  return response.json()
}

export async function login(username: string, password: string): Promise<AuthToken> {
  const response = await fetch(`${API_BASE_URL}/api/users/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
  })
  if (!response.ok) {
    const data = await response.json().catch(() => null)
    throw new Error(data?.detail ?? 'Invalid username or password')
  }
  return response.json()
}

export interface LanSettingsUpdate {
  name: string
  lan_date: string | null
}

export async function updateLanSettings(
  token: string,
  data: LanSettingsUpdate,
  file: File | null,
): Promise<LanSettingsDto> {
  const formData = new FormData()
  formData.append('name', data.name)
  if (data.lan_date) {
    formData.append('lan_date', data.lan_date)
  }
  if (file) {
    formData.append('file', file)
  }

  const response = await fetch(`${API_BASE_URL}/api/lan-settings`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    throw new ApiError(body?.detail ?? 'Failed to save LAN settings', response.status)
  }
  return response.json()
}
