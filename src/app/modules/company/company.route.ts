import { Router } from "express";
import { CompanyController } from "./company.controller";

const companyRoute = Router();
const companyController = new CompanyController();

companyRoute.get("/", companyController.getAll.bind(companyController));
companyRoute.get("/:id", companyController.getById.bind(companyController));
companyRoute.post("/", companyController.create.bind(companyController));
companyRoute.put("/:id", companyController.update.bind(companyController));
companyRoute.delete("/:id", companyController.delete.bind(companyController));

export default companyRoute;
