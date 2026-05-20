import { Router } from "express";
import { authController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { UserSchema } from "../user/user.validation";

const authRoute = Router();

authRoute.post("/register", validateRequest(UserSchema), authController.handleRegister);
authRoute.post("/login", authController.handleLogin);

export default authRoute;
