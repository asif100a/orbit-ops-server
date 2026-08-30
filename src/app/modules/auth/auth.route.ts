import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserSchema } from "../user/user.validation";
import { ForgotPasswordSchema, LoginSchema, ResetPasswordSchema, VerifyOtpSchema } from "./auth.validation";

const authRoute = Router();

// Register
authRoute.post("/register", validateRequest(UserSchema), authController.handleRegister.bind(authController));
// Login
authRoute.post("/login", validateRequest(LoginSchema), authController.handleLogin.bind(authController));
// Refresh
authRoute.post("/refresh", authController.handleRefresh.bind(authController));
// Logout
authRoute.post('/logout', authController.handleLogout.bind(authController));
// Verify OTP
authRoute.post('/verify-otp', validateRequest(VerifyOtpSchema), authController.handleVerifyOtp.bind(authController))
// Resend OTP
authRoute.post('/resend-otp', authController.handleResendOtp.bind(authController));
// Forgot Password
authRoute.post('/forgot-password', validateRequest(ForgotPasswordSchema), authController.handleForgotPassword.bind(authController));
// Verify Forgot OTP
authRoute.post('/verify-forgot-password-otp', validateRequest(VerifyOtpSchema), authController.handleVerifyForgotPasswordOtp.bind(authController))
// Reset Password
authRoute.post('/reset-password', validateRequest(ResetPasswordSchema), authController.handleResetPassword.bind(authController));

export default authRoute;
