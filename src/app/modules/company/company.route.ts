import { Router } from "express";
import { CompanyController } from "./company.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { CompanySchema } from "./company.validation";

const companyRoute = Router();
const companyController = new CompanyController();

// Get All Company
companyRoute.get("/", companyController.getAll.bind(companyController));
// Get Single Company
companyRoute.get("/:id", companyController.getById.bind(companyController));
// Create Company
companyRoute.post("/", validateRequest(CompanySchema), companyController.create.bind(companyController));
// Verify Company
companyRoute.post('/:companyId/verify', companyController.verify.bind(companyController));
// Update Company
companyRoute.put("/:id", validateRequest(CompanySchema), companyController.update.bind(companyController));
// Delete Company
companyRoute.delete("/:id", companyController.delete.bind(companyController));

export default companyRoute;
