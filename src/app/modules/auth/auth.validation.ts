import { z } from "zod";

export const VerifyOtpSchema = z.object({
  email: z.email("Please provide a valid email address"),
  otp: z
    .string()
    .length(6, "OTP must be 6 characters long")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export type VerifyOtp = z.infer<typeof VerifyOtpSchema>;
