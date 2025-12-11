import { z } from 'zod'

export const ProfileSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  birthday: z.date().optional(),
  bio: z.any().optional(),
  image: z
    .instanceof(File)
    .refine((file) => file.size < 4500000, {
      message: 'Image must be less than 4.5MB',
    })
    .optional(),
  imageUrl: z.string().optional(),
})

export type ProfileSchemaType = z.infer<typeof ProfileSchema>

export const passwordSchema = z.object({
  password: z.string().min(8),
  // newPassword: z.string().min(8),
  confirmPassword: z.string().min(8),
})

export type PasswordSchemaType = z.infer<typeof passwordSchema>

export const passwordErrors = {
  PASSWORD_REQUIRED: 'Current password is required',
  PASSWORD_INCORRECT: 'Current password is incorrect',
  PASSWORD_MISMATCH: 'Passwords do not match',
  PASSWORD_WEAK: 'Password must be at least 8 characters long',
  USER_LOCKED: 'Error: This user is locked due to having too many failed login attempts.',
  DEFAULT: 'An unknown error occurred',
  INCORRECT_PASSWORD: 'Error: The email or password provided is incorrect.',
}
