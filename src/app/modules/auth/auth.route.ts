import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserSchema } from "../user/user.validation";
import { checkAuth } from "../../middlewares/checkAuth";
import { VerifyOtpSchema } from "./auth.validation";

const authRoute = Router();

authRoute.post("/register", validateRequest(UserSchema), authController.handleRegister.bind(authController));
authRoute.post("/login", authController.handleLogin.bind(authController));
authRoute.post("/refresh", authController.handleRefresh.bind(authController));
authRoute.post('/logout', checkAuth(), authController.handleLogout.bind(authController));
authRoute.post('/verify-otp', validateRequest(VerifyOtpSchema), authController.handleVerifyOtp.bind(authController))

export default authRoute;
