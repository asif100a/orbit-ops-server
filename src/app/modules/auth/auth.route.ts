import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserSchema } from "../user/user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { VerifyOtpSchema } from "./auth.validation";

const authRoute = Router();

// Register
authRoute.post("/register", validateRequest(UserSchema), authController.handleRegister.bind(authController));
// Login
authRoute.post("/login", authController.handleLogin.bind(authController));
// Refresh
authRoute.post("/refresh", authController.handleRefresh.bind(authController));
// Logout
authRoute.post('/logout', checkAuth(), authController.handleLogout.bind(authController));
// Verify OTP
authRoute.post('/verify-otp', validateRequest(VerifyOtpSchema), authController.handleVerifyOtp.bind(authController))
// Forgot Password
authRoute.post('/forgot-password', authController.handleForgotPassword.bind(authController));
// Verify Forgot OTP
authRoute.post('/verify-forgot-password-otp', authController.handleVerifyForgotPasswordOtp.bind(authController))
// Reset Password
authRoute.post('/reset-password', authController.handleResetPassword.bind(authController));

export default authRoute;
