import { Router } from "express";
import { CompanyController } from "./company.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { CompanySchema } from "./company.validation";

const companyRoute = Router();
const companyController = new CompanyController();

companyRoute.get("/", companyController.getAll.bind(companyController));
companyRoute.get("/:id", companyController.getById.bind(companyController));
companyRoute.post("/", validateRequest(CompanySchema), companyController.create.bind(companyController));
companyRoute.put("/:id", validateRequest(CompanySchema), companyController.update.bind(companyController));
companyRoute.delete("/:id", companyController.delete.bind(companyController));

export default companyRoute;
