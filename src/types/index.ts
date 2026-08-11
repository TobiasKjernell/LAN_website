export interface LanSettings {
  eventName: string
  targetDate: string
  backgroundImage: string | null
}

export interface LanSettingsDto {
  id: number
  name: string
  lan_date: string | null
  image_file: string | null
  image_url: string | null
}

export interface AuthToken {
  access_token: string
  token_type: string
}

export interface Credentials {
  username: string
  password: string
}
