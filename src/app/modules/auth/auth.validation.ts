import { z } from "zod";

// Login Schema
export const LoginSchema = z.object({
  email: z.email({message: "Please provide a valid email address"}),
  password: z.string().min(8, "Password must be at least 8 characters long"),
})
export type Login = z.infer<typeof LoginSchema>;

// Verify OTP Schema
export const VerifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 characters long")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});
export type VerifyOtp = z.infer<typeof VerifyOtpSchema>;

// Forgot Password Schema
export const ForgotPasswordSchema = z.object({
  email: z.email("Please provide a valid email address"),
});
export type ForgotPassword = z.infer<typeof ForgotPasswordSchema>;

// Reset Password Schema
export const ResetPasswordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
});
export type ResetPassword = z.infer<typeof ResetPasswordSchema>;
