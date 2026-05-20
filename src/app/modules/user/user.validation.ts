import { z } from "zod";

export const UserSchema = z.object({
  name: z.string().min(3, '"Name" is required'),
  email: z.email('Please provide a valid email address'),
  password: z.string().min(8, 'Please provide the password'),
  confirmPassword: z.string().min(8, 'Please provide the confirm password'),
  companyId: z.string().min(1, 'Please provide the companyId'),
  departmentId: z.string().min(1, 'Please provide the departmentId'),
  teamId: z.string().min(1, 'Please provide the teamId'),  
})

export type User = z.infer<typeof UserSchema>