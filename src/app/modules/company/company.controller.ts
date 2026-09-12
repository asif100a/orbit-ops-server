import type { Request, Response } from "express";
import { CompanyService } from "./company.service";
import { catchAsync } from "../../utils/index";
import type { CompanyResponseType } from "./company.interface";
import AppError from "../../errorHandlers/AppError";

const companyService = new CompanyService();

export class CompanyController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const data = await companyService.findAll();
      res.status(200).json({
        success: true,
        message: "The company data retrieved successfully",
        data,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    const paramsId = req.params.id;
    if (!paramsId) {
      throw new Error("Id not found!");
    }
    try {
      const data = await companyService.findById(paramsId as string);
      if (!data) {
        res.status(404).json({
          success: false,
          message: "Company not found",
        });
        return;
      }
      res.status(200).json({
        success: true,
        message: "The company data retrieved successfully",
        data,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      console.log("Company Req log: ", req.body);
      const userId = req.user?.id;
      if (!userId) {
        throw new AppError(401, "Authenticated user not found");
      }

      const company = await companyService.create(userId, req.body);

      res.status(201).json({
        success: true,
        message: "The company data created successfully",
        data: company,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async verify(req: Request, res: Response) {
    const body = req.body;
    console.log('verify-company body: ', body)
    try {
      if (!body.companyId) {
        throw new AppError(400, "Id not found");
      }
      if (!body.otp) {
        throw new AppError(400, "OTP not found");
      }
      const company = await companyService.verify(body.companyId, body.otp);

      res.status(200).json({
        success: true,
        message: "Company verified successfully",
        data: company,
      });
    } catch (error) {
      catchAsync(res, error)
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    const paramsId = req.params.id;
    if (!paramsId) {
      throw new Error("Id not found!");
    }
    try {
      const data = await companyService.update(paramsId as string, req.body);
      res.status(200).json({
        success: true,
        message: "The company data updated successfully",
        data,
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const paramsId = req.params.id;
      if (!paramsId) {
        throw new Error("Id not found!");
      }
      await companyService.delete(paramsId as string);
      res.status(200).json({
        success: true,
        message: "The company data deleted successfully",
      });
    } catch (error: any) {
      catchAsync(res, error);
    }
  }
}
