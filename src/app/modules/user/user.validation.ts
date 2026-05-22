import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(3, '"Name" is required'),
  email: z.email('Please provide a valid email address'),
  password: z.string().min(8, 'Please provide the password').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
    'Password must contain at least 8 characters, one uppercase, one lowercase, one number and one special character'),
  confirmPassword: z.string().min(8, 'Please provide the confirm password'),
  status: z.string().enum('pending' | 'approved' | 'rejected' | 'suspended')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password don't match",
  path: ['confirmPassword']
})

export type User = z.infer<typeof UserSchema>