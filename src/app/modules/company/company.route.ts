import { Router } from "express";
import { CompanyController } from "./company.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { CompanySchema } from "./company.validation";
import { checkAuth } from "../../middlewares/checkAuth";

const companyRoute = Router();
const companyController = new CompanyController();

companyRoute.get("/", companyController.getAll.bind(companyController));

companyRoute.get("/:id", companyController.getById.bind(companyController));

companyRoute.post(
  "/",
  checkAuth(),
  validateRequest(CompanySchema),
  companyController.create.bind(companyController),
);

companyRoute.post(
  "/verify",
  companyController.verify.bind(companyController),
);

companyRoute.put(
  "/:id",
  checkAuth(),
  validateRequest(CompanySchema),
  companyController.update.bind(companyController),
);

companyRoute.delete(
  "/:id",
  checkAuth(),
  companyController.delete.bind(companyController),
);

export default companyRoute;