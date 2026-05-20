import { Router } from "express";
import { authController } from "./auth.controller";

const authRoute = Router();

authRoute.post("/register", authController.handleRegister);
authRoute.post("/login", authController.handleLogin);

export default authRoute;
