import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const userRoute = Router();
const userController = new UserController();

userRoute.get("/", userController.getAll.bind(userController));

userRoute.get(
  "/my-profile",
  checkAuth(),
  userController.getMyProfile.bind(userController),
);

userRoute.get("/:id", userController.getById.bind(userController));

export default userRoute;