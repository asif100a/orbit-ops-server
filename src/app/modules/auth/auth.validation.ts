import {z} from 'zod'

export const VerifyOtpSchema = z.object({
    email: z.email('Please provide a valid email address'),
    otp: z.number().min(6, 'OTP must be 6 characters long')
})

export type VerifyOtp = z.infer<typeof VerifyOtpSchema>