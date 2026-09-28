import { Router } from "express";
import { UserController } from "./user.controller";
import { checkAuth } from "../../middlewares/checkAuth";

const userRoute = Router();
const userController = new UserController();

userRoute.get("/", checkAuth(), userController.getAll.bind(userController));

userRoute.get(
  "/my-profile",
  checkAuth(),
  userController.getMyProfile.bind(userController),
);

userRoute.get("/:id", checkAuth(), userController.getById.bind(userController));

export default userRoute;
