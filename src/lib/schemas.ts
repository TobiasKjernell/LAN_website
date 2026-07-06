import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const settingsSchema = z.object({
  eventName: z.string().min(1, 'Event name is required').max(80, 'Keep it under 80 characters'),
  targetDate: z
    .string()
    .min(1, 'Target date is required')
    .refine((value) => !Number.isNaN(new Date(value).getTime()), 'Enter a valid date'),
  backgroundImage: z.string().nullable(),
})

export type SettingsFormValues = z.infer<typeof settingsSchema>
